/* Recupero le news */
getNews = function(request,json, filter, page, callback){
        
    jsonbean = new Object();
       
    //Setto il device ID
    jsonbean.deviceId = deviceID;
    
    //Setto il numero di righe per pagina
    jsonbean.numRows = rowforpage;      
    
    //Righe di partenza
    startrow = 0;
    if(page>1){
        startrow = (page-1)*rowforpage;
    }    
    jsonbean.startRow = startrow;
    
    if(filter){
        jsonbean.filter = filter;
    }
    
    var datajson = json.stringify(jsonbean);
    var urllogin = url+"FacadeClient/getNews";
    var promise = request.post(urllogin,{
    handleAs: "json",
    data: datajson,
    headers: {
            "X-Requested-With": null,
            "Content-Type":"application/json"                        
            }           
    }); 
    
    promise.response.then(
        function(response) {
            //Controllo messaggi di errore
            var message = response.data.messageList;
            error = false;
            if(message && message.length>0){
                if(message[0]=='IROK'){
                    error = false;
                }else{
                    errorlog(message[0]);
                }
            }
                    
            //Recupeoro i dati delle news
            if(!error){
                var news = response.data.objectList;
                callback(news);           
            }
            
        },
        function(error) {
            errorlog("Errore Recupero News",error);            
        });
}

/* Recupero le immagini delle offerte */
getOfferImages = function(request,offerid,callback){
    
    var urllogin = url+"FacadeClient/getOfferImages?deviceId="+deviceID+"&offerId="+offerid;
    var promise = request.post(urllogin,{
    handleAs: "json",
    headers: {
            "X-Requested-With": null,
            "Content-Type":"application/json"                        
            }           
    }); 
    
    promise.response.then(
        function(response) {
            //Controllo messaggi di errore
            var message = response.data.messageList;
            error = false;
            if(message && message.length>0){
                if(message[0]=='IROK'){
                    error = false;
                }else{
                    errorlog(message[0]);
                }
            }
                    
            //Recupeoro i dati delle immagini
            if(!error){
                var images = response.data.objectList;
                callback(images);           
            }
            
        },
        function(error) {
            errorlog("Errore Recupero Immagini",error);            
        });
    
    
}