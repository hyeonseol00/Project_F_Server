import { handleError } from "../../utils/error/errorHandler.js";
import { getUserBySocket } from "../../session/user.session.js";
import { itemTable } from "../../session/sessions.js";
import { getItemById } from "../../session/item.session.js";
import User from "../../classes/models/user.class.js";
import { getItemCostbyId } from "../../session/item.session.js";

const buyItemHandler = async ({ socket, payload }) => {
    try{
        const user = getUserBySocket(socket);
        const { characterId } = user;
        // const {itemId , itemName ,itemType, itemCost } = itemTable;

        //유저가 사고 싶은 아이템 ID 가져오기
        const { itemId: buyItemId } = payload;
        const buyItem = getItemById(buyItemId);

        //유저 골드가 충분할 경우
        if(user.gold >= itemCost){
            const itemCost = getItemCostbyId(itemId); //아이템 아이디를 통해 판매 가격 확인

            //유저 아이템 DB에서 인벤토리 수정
            user.mountingItems.push(buyItem);
            
            user.gold -= itemCost;      //유저 DB에서 골드 수정
        
            const buyItemResponse = createResponse('response', 'S_BuyItem', {
                playerId: user.playerId,
                itemId : user.itemId,
                Msg : `구매 성공! ${itemName}을(를) ${itemCost}G로 구매하였습니다. 남은 골드: ${user.gold}G`,
            });
                socket.write(buyItemResponse);
                return;
        }else{
            console.error("구매할 아이템이 존재하지 않습니다.");
            return; 
        }



    }catch (err){
        handleError(socket, err);
    }

};

export default buyItemHandler;