/* Recupero le news */
getNews = function(request,json, filter,favourite, page, callback){
        
    jsonbean = new Object();
       
    //Setto il device ID
    jsonbean.deviceId = deviceID;
    
    //Setto il numero di righe per pagina
    jsonbean.numRows = rowforpage;      
    
    //Setto i preferiti
    if(favourite){
        jsonbean.star = favourite;
    }
    
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
};



/* Salvo sulle preferenze */
setMerchantPreferredByQrCode = function(request,qrcode,callback){

    var urlservice = url+"FacadeClient/setMerchantPreferredByQrCode?deviceId="+deviceID+"&preferred=true&qrCode="+qrcode;
    var promise = request.post(urlservice,{
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
            if(!error){
                callback();           
            }            
        },
        function(error) {
            errorlog("Errore Salvataggio Preferenza",error);            
        });
};



getEvent = function(request,json, filter,merchantid,favourite, page, callback){
        
    jsonbean = new Object();
       
    //Setto il device ID
    jsonbean.deviceId = deviceID;
    
    //Setto il numero di righe per pagina
    jsonbean.numRows = rowforpage;      
    
    //Setto il merchant
    if(merchantid){
        lst = new Array();
        lst.push(merchantid);
        jsonbean.merchantIds = lst;
    }
    
    //Setto i preferiti
    if(favourite){
        jsonbean.star = favourite;
    }
    
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
    var urllogin = url+"FacadeClient/getEventsFilter";
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
                var events = response.data.objectList;
                callback(events);           
            }            
        },
        function(error) {
            errorlog("Errore Recupero Evento",error);            
        });
};


getEventImages = function(request,eventId,callback){
    
    var urllogin = url+"FacadeClient/getEventImages?deviceId="+deviceID+"&eventId="+eventId;
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
};



getMessage = function(request,json, filter,merchantid,favourite, page, callback){
        
    jsonbean = new Object();
       
    //Setto il device ID
    jsonbean.deviceId = deviceID;
    
    //Setto il numero di righe per pagina
    jsonbean.numRows = rowforpage;      
    
    //Setto il merchant
    if(merchantid){
        lst = new Array();
        lst.push(merchantid);
        jsonbean.merchantIds = lst;
    }
    
    //Setto i preferiti
    if(favourite){
        jsonbean.star = favourite;
    }
    
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
    var urllogin = url+"FacadeClient/getMessagesFilter";
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
                var messages = response.data.objectList;
                callback(messages);           
            }            
        },
        function(error) {
            errorlog("Errore Recupero Messaggi",error);            
        });
}



getOffer = function(request,json, filter,merchantid,favourite, page, callback){
    
    jsonbean = new Object();
       
    //Setto il device ID
    jsonbean.deviceId = deviceID;
    
    //Setto il numero di righe per pagina
    jsonbean.numRows = rowforpage;      
    
    //Setto il merchant
    if(merchantid){
        lst = new Array();
        lst.push(merchantid);
        jsonbean.merchantIds = lst;
    }
    
    //Setto i preferiti
    if(favourite){
        jsonbean.star = favourite;
    }
    
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
    var urllogin = url+"FacadeClient/getOffersFilter";
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
                var offers = response.data.objectList;
                callback(offers);           
            }            
        },
        function(error) {
            errorlog("Errore Recupero Offerte",error);            
        });
};


getShowcase = function(request,json, filter,favourite, page, callback){
        
    jsonbean = new Object();
       
    //Setto il device ID
    jsonbean.deviceId = deviceID;
    
    //Setto il numero di righe per pagina
    jsonbean.numRows = rowforpage;      
    
    //Setto i preferiti
    if(favourite){
        jsonbean.star = favourite;
    }
    
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
    var urllogin = url+"FacadeClient/getMerchantsFilter";
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
                var showcases = response.data.objectList;
                callback(showcases);           
            }            
        },
        function(error) {
            errorlog("Errore Recupero Vetrine",error);            
        });
};



getShowcaseImages = function(request,eventId,callback){
    
    var serviceurl = url+"FacadeClient/getShowcaseImages?deviceId="+deviceID+"&eventId="+eventId;
    var promise = request.post(serviceurl,{
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
};


/* Recupero le immagini delle offerte */
isShowcasePreferred = function(request,merchantid,callback){
    
    var urlservice = url+"FacadeClient/isMerchantsPreferred?deviceId="+deviceID+"&merchantId="+merchantid;
    var promise = request.post(urlservice,{
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
                var datas = response.data.objectList;
                callback(datas[0]);           
            }
            
        },
        function(error) {
            errorlog("Errore Recupero Preferenza",error);            
        });   
};


/* Salvo sulle preferenze */
setMerchantPreferred = function(request,mercantId,preferred,callback){

    var urlservice = url+"FacadeClient/setMerchantPreferred?deviceId="+deviceID+"&preferred="+preferred+"&merchantId="+mercantId;
    var promise = request.post(urlservice,{
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
            if(!error){
                callback();           
            }            
        },
        function(error) {
            errorlog("Errore Salvataggio Preferenza",error);            
        });
};


/* Salvo il device info */
setDeviceInfo = function(request,brand,model,opsystem,opversion,token,callback){

    var urlservice = url+"FacadeClient/saveDeviceInfo?deviceId="+deviceID+"&brand="+brand+"&model="+model+"&opsystem="+opsystem+"&opversion="+opversion;
    
    if(token){
      urlservice += "&token="+token;  
    }
    
    var promise = request.post(urlservice,{
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
            if(!error){
                var datas = response.data.objectList;
                callback(datas[0]);           
            }            
        },
        function(error) {
            errorlog("Errore Salvataggio Preferenza",error);            
        });
};


