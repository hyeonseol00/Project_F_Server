import { handleError } from "../../utils/error/errorHandler.js";
import { getUserBySocket } from "../../session/user.session.js";
import { itemTable } from "../../session/sessions.js";
import { getItemById } from "../../session/item.session.js";
import User from "../../classes/models/user.class.js";
import { getItemCostbyId } from "../../session/item.session.js";

const sellItemHandler = async ({ socket, payload }) => {
    try{
        const user = getUserBySocket(socket);
        const { characterId } = user;
        const {itemId , itemName ,itemType, itemCost } = itemTable;

        //유저가 판매하고 싶은 아이템 ID 가져오기
        const { itemId : getItemId } = payload;
        const sellItem = getItemById(getItemId);

        //아이템 테이블과 팔고싶은 아이템 ID가 같을 경우
        if(itemId === sellItem.itemId){
            const itemCost = getItemCostbyId(itemId); //아이템 아이디를 통해 판매 가격 확인
            
            //유저 아이템 DB에서 인벤토리 수정
            user.mountingItems = user.mountingItems.filter((item) => item.itemId !== sellItem.itemId);
            
            user.gold += itemCost;   //유저 DB에서 골드 수정


            const sellItemResponse = createResponse('response', 'S_SellItem', {
                playerId: user.playerId,
                itemId: user.itemId,
                msg : `판매 성공! ${itemName}을(를) ${gold}G로 판매하였습니다. 남은 골드: ${user.gold}`,
              });
              socket.write(sellItemResponse);
              return;
        }else{
            console.error("판매할 아이템이 존재하지 않습니다.");
            return; 
        }



    }catch (err){
        handleError(socket, err);
    }

};

export default sellItemHandler;