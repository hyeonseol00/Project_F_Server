const leaveTownHandler = async ({socket, payload}) => {

    const { playerId: curPlayerId }  = payload;

    try{

        const playerIds = [];

        // 게임 세션에 저장된 모든 플레이어의 정보를 가져옴
        for(const user of gameSessions[0].users){
            if(curPlayerId === user.playerInfo.playerId) continue;
            playerIds.push(user.playerInfo.playerId);
        }


        // 각 유저에게 본인을 제외한 플레이어 데이터 전송
        for (const user of gameSessions[0].users) {  
            const filterdplayerIds = playerIds.filter((playerId) => playerId !== curPlayerId)
            
            // 해당 유저에게 다른 유저들을 스폰(해당 유저 제외)
            const despawnTownResponse = createResponse('response', 'S_Despawn', {
                playerIds: filterdplayerIds
            });
    
            user.socket.write(despawnTownResponse);
        }

    }
    catch (err) {
        handleError(socket, err);
    }
}

export default leaveTownHandler;