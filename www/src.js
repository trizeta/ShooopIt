/**
* Variabili globali di utenza
*/
user = null;
debug = false;
url = "http://37.59.80.107/messaging/rest/";
urlimage = "http://37.59.80.107/images/";

//Variabile per il messaggio
message = null;
dlg = null;

//Filtro id
actualfilterid = null;

//Massimo numero di righe per pagina
rowforpage = 25;

//ID del Device
deviceID = null;

//Oggetto selezonato per il dettaglio
actualobject = null;


/* Configurazione Iniziale */
var dojoConfig={
    baseUrl: "",
    tlmSiblingOfDojo: false,
    isDebug: true, 
    packages: [
        { name: "dojo", location: "script/dojo" },
        { name: "dijit", location: "script/dijit" },
        { name: "dojox", location: "script/dojox" },
        { name: "dojo._base", location: "script/dojo/base" },
    ]
};

require([
    "dojo/ready",
    "dojo/_base/window",
    "dojo/dom-construct",
	"dojo/store/Memory",
	"dojo/store/Observable",
	"dijit/registry",
	"dojo/on",
	"dojo/dom",
	"dojox/mobile/ProgressIndicator",
	"dojo/date/stamp",
	"dojo/date/locale",
	"dojo/dom-style",
    "dojox/mobile/ListItem",
    "dojo/_base/array",
    "dojo/_base/connect",
    "dojo/dom-class",
    "dojox/mobile/ToolBarButton",
    "dojox/mobile/IconItem",
    "dojox/mobile/SimpleDialog",
    "dojox/mobile/Button",
    "dojox/mobile/SwapView",
    "dojox/mobile/CarouselItem",
    "dojox/mobile/Icon",
    "dojox/mobile/PageIndicator",
    "dojo/request", 
    "dojo/json",
    "dojox/mobile/Pane",
    "dojo/number",
    "dojox/mobile/Carousel",
    "dojo/_base/Deferred",
	"dojox/mobile/parser",
	"dojox/mobile",
	"dojox/mobile/ComboBox",
	"dojox/mobile/compat",
	"dojox/mobile/ScrollableView",
	"dojox/mobile/RoundRectStoreList",
	"dojox/mobile/RoundRect",
     "dojox/mobile/StoreCarousel",
	"dojox/mobile/TextBox",
    "dojox/uuid/generateRandomUuid",
    "dojox/mobile/ScrollablePane",    
	"dojox/mobile/TabBar",
	"dojox/mobile/ToolBarButton",
	"dojox/mobile/TextBox",
	"dojox/mobile/TextArea",
	"dojox/mobile/CheckBox",
	"dojox/mobile/Switch",
	"dojox/mobile/Button",
	"dojox/mobile/EdgeToEdgeStoreList",
    "dojox/mobile/ExpandingTextArea",
    "dojox/mvc/Group",
	"dojox/mobile/EdgeToEdgeDataList",
	"dojox/mobile/FilteredListMixin",
	"dojox/mobile/RoundRect",
	"dojox/mobile/FormLayout",
	"dojox/mobile/Opener",
	"dojox/mobile/SearchBox",
	"dojox/mobile/SpinWheelDatePicker",
    "dojox/mobile/SimpleDialog",
    "dojox/mobile/GridLayout",   
    "dojox/uuid/generateRandomUuid",
    "dojox/mobile/PullView",
    "dojox/mobile/IconContainer",
    "dojox/mobile/RadioButton",
    "dojox/mobile/IconMenu",
    "dojox/mobile/Badge",
    "dojox/mobile/IconMenuItem"  
	
], function(ready, win, domConstruct, Memory, Observable, registry, on, dom,ProgressIndicator,stamp,locale,domStyle,ListItem,array,connect,domClass,ToolBarButton,IconItem,SimpleDialog,Button,SwapView,CarouselItem,Icon,PageIndicator,request,json,Pane,number,Carousel) {
	
		var dateformat = "dd/MM/yyyy";
        var progoffer, progmessage, progshowcase,progeventi; 
        var delItem, handler;
         
        /* Caricamento dinamico dei bottoni */
        showheadingbuttons = function(buttons){
            registry.byId("heading").destroyDescendants();
            for(i=0;i<buttons.length;i++){ 
                registry.byId("heading").addChild(new ToolBarButton(buttons[i]));             
            }               
        } 
        
        storeofferimage = dojo.store.Observable(new Memory({}));
        
        
		ready(function() {
	    	document.addEventListener("deviceready", onDeviceReady, false);   
                        
            /****************************************************************************
            *                   Definizione dei bottoni di header                       *
            *****************************************************************************/
            
            //Back Button
            var back =  {class:"icon ion-ios7-arrow-back size-32", style:"float:left"};
            
            //Logout Button
            var logout =  {class:"icon ion-log-out size-32", onTouchStart:logoutuser,  style:"float:left"};
            
            //Nascondo i search
            domStyle.set('filterBoxNewsDiv', 'display', 'none');
                        
            actualfilterid = "filterBoxNewsDiv";
            domStyle.set('headingnews', 'display', 'inline');    
            
            /****************************************************************************
            *   Aggiungo il controllo dei bottoni prima della transazione di apertura   *
            *****************************************************************************/                
            dojo.connect(registry.byId("ViewApplication"), "onBeforeTransitionIn", null, function(){
                showheadingbuttons([]);
                domStyle.set('headinghome', 'display', 'inline');     
            });
                           
            dojo.connect(registry.byId("offerdetail"), "onBeforeTransitionIn", null, function(){
                //Creo il dettaglio dell'offerta
                createofferdetail(actualobject);            
            });
             
            connect.subscribe("/dojox/mobile/carouselSelect", function(carousel, itemWidget, itemObject, index){
                //Visualizzo a tutto schermo l'immagine
                var imgdetailview = registry.byId("imagedetail");            
                            
                dom.byId("imgdetail").src = itemObject.src;

                imgdetailview.show();                                          
            });
                        
            //TODO DA COMMENTARE PER NATIVA
            //onDeviceReady(); 
	    });
		
        function onDeviceReady() {
            
            try{
                //Recupero id del dispositivo
                deviceID = device.uuid;
            }catch(e) {
                deviceID = 'demo';
            }           
            
            try {                
                //Inizializzo imgcache
                ImgCache.init(function(){
                    searchnews(null,false,false); 
                }, function(){
                    searchnews(null,false,false); 
                });          
            } catch(e){
                errorlog("ERROR LOAD NEWS",e);
            } 
            
             try{   
                //Nascondo lo splah screen
                navigator.splashscreen.hide();                      
            } catch(e) {
                errorlog("ERRORE VIEW APP - 100",e);
            } 
            document.addEventListener("backbutton", onBackKeyDown, false);     
        };
    
        onBackKeyDown = function(e){
           createConfirmation("Sei sicuro di uscire da Shooopit?", 
            function(){
               navigator.app.exitApp(); 
            }, 
            function(){
                //Non fa nulla
                e.preventDefault();
            }); 
        }
            
          
        /* Funzione di pull per sincronizzare le offerte */
        onPullNews = function(view, y, h){
          dom.byId("msg1offer").innerHTML = percent < 100 ? "Tira per aggiornare le news" : "Rilascia per aggiornare le news";
          y = y > h ? h : y;
          var percent = y / h * 100;
          var deg = -1.8 * percent + 360;
          dom.byId("iconoffer").style.webkitTransform = "rotate(" + deg + "deg)";
        };
        
        /* Funzione di Pulled per sincronizzare */
        onPulledNews = function(view){
          if(!progoffer){
					progoffer = new ProgressIndicator({size:20, center:false});
            }
			if(progoffer.timer){ return; }
			dom.byId("iconoffer").style.display = "none";
			dom.byId("msg1offer").innerHTML = "Attendere...";
			dom.byId("progoffer").appendChild(progoffer.domNode);
			progoffer.start();
             
            //TODO Aggiungere filtro
            searchnews(null,false,false,function(){
                registry.byId("tabNews").slideTo({y:0}, 0.3, "ease-out");
                progoffer.stop();
                dom.byId("iconoffer").style.display = "inline"; 
            });                      
         };

         opensearch = function(){
            if(actualfilterid){
                var type = domStyle.get(actualfilterid, 'display');
                if(type=='none'){
                    domStyle.set(actualfilterid, 'display', 'block');
                }else{
                    domStyle.set(actualfilterid, 'display', 'none');
                    registry.byId('filterBoxNews').set('value',null);
                }
            }        
         };

/****************************************************************************************************************
*                                   Recupero delle news
****************************************************************************************************************/

searchnews = function(filter,append,favourite,callback){
    //Carico le News
    startLoading();
    getNews(request,json,filter,favourite,1,function(news){
        
        var gridnews = registry.byId("gridnews");
        
        //Elimino le vecchie news
        if(!append){
            gridnews.destroyDescendants();        
        }
        
        //Ciclo le news 
        for(i=0;i<news.length;i++){                        
            //Aggiungo i Pane e carico le immagini
            try{  
                object_type = news[i].objectType;
                var html = null;
                //Controllo il tipo di oggetto
                if(object_type=='O'){
                    //Offerte
                    html = news[i].title;
                }else if(object_type=='M'){
                    //Messaggi
                    if(news[i].description){
                        html = news[i].description;
                    }
                }else if(object_type=='E'){
                    //Eventi
                    html = news[i].title;
                } 
                
                if(html){
                    pane = new Pane();                                       
                    pane.set("bean",news[i]);
                    pane.on("click",function(){opendetailnews(this.id)});
                                        
                    var msgBox = domConstruct.create("div", {class: "innerPane"}, pane.domNode);
                    if(object_type != 'M'){
                        var srcimage = urlimage+news[i].fullPathName;
                        var imgBox = domConstruct.create("img", {src:srcimage, class:"innerPaneImg"}, msgBox);

                        //Controllo se esiste l'immagine
                        ImgCache.isCached(srcimage, function(path, success) {                    
                            if(success) {
                                ImgCache.useCachedFile(imgBox);
                            } else {
                                ImgCache.cacheFile(srcimage, function(){
                                    ImgCache.useCachedFile(imgBox);
                                });
                            }
                        });   
                    }
                    var labelBox = domConstruct.create("span", {innerHTML: html}, msgBox);
                    gridnews.addChild(pane); 
                    pane.startup();
                }                    
            }catch(e){
                errorlog("SEARCH NEWS",e);
            }
        } 
        stopLoading();
        if(callback){
            callback();
        }
    });      
};


/* Metodo di apertura del dettaglio della news*/
opendetailnews = function(id) {
    
    news = registry.byId(id).get("bean");  
    actualobject = news;    
    if(news.objectType=='O'){
        //Apro il dettaglio dell'offerta
        registry.byId("tabNews").performTransition("offerdetail", 1, "slide"); 
    }else if(news.objectType=='E'){
        //Apro il dettaglio dell'evento
        registry.byId("tabNews").performTransition("eventdetail", 1, "slide"); 
    }else if(news.objectType=='M'){
        //Apro il dettaglio del messaggio
        registry.byId("tabNews").performTransition("messagedetail", 1, "slide"); 
    }
};



createofferdetail = function(){
    //Elimino la vecchia visualizzazione
    detailoffer = registry.byId("offerdetail");
    
    //Elimino il vecchio panello
    if( registry.byId("paneofferdetail")){
        registry.byId("paneofferdetail").destroyRecursive(false);
    }
    
    offer = actualobject;
        
    //Creo il pannello
    pane = new Pane({id:"paneofferdetail"});
    
    //Controllo date dell'offerte
    msgdate = "Offerta Valida ";
    if(offer.dateFrom) {
        msgdate += ' dal '+locale.format(new Date(offer.dateFrom),{selector: "date", formatLength: "short", datePattern:dateformat});
    }
    
    if(offer.dateTo){
        msgdate += ' fino al '+locale.format(new Date(offer.dateTo),{selector: "date", formatLength: "short", datePattern:dateformat});
    }  
    
    if(offer.ragSoc){
        msgdate += "</br>"+offer.ragSoc;
    }
    
    if(offer.title){
        msgdate += "</br>"+offer.title;
    }
    
    if(offer.quantity) {
        msgdate += "</br> Quantità "+offer.quantity;
    }
    
    if(offer.price){
        msgdate += "</br> Prezzo "+number.format(offer.price)+" €";
    }
            
    var msgBox = domConstruct.create("div", {class: "innerPaneDetail", innerHTML:msgdate}, pane.domNode);    
    detailoffer.addChild(pane,0);  
        
    // Visualizzo la descrizione dell'offerta
    if( registry.byId("paneofferdetailhtml")){
        registry.byId("paneofferdetailhtml").destroyRecursive(false);
    } 
    //Creo il pannello
    panehtml = new Pane({id:"paneofferdetailhtml"});
    var msgBoxhtml = domConstruct.create("div", {class: "innerPaneDetail", innerHTML:offer.description}, panehtml.domNode);    
    detailoffer.addChild(panehtml);
    
    //Recupero le immagini dell'offerta
    getOfferImages(request,news.objectId,function(images){         
        var imgs = new Array();
        for(i=0;i<images.length;i++) {
            var srcimage = images[i].fullPathName;
            var obj = new Object();
            obj.src = srcimage;  
            imgs.push(obj);                     
        }
        storeofferimage.setData(imgs);
        registry.byId("carouselofferimage").refresh();
    });
};


favouritesearch = function(favourite) {    
    var value = registry.byId('filterBoxNews').get('value');
    if(favourite) {
    //Controllo lo stato dei preferiti
        domStyle.set('favouritebuttonko', 'display','none');
        domStyle.set('favouritebuttonok', 'display','inline');
        searchnews(value,false,true);
    
    } else {
        domStyle.set('favouritebuttonko', 'display','inline');
        domStyle.set('favouritebuttonok', 'display','none');
        searchnews(value,false,false);
    }
};


searchnewsfilter = function(){
    fav = domStyle.get('favouritebuttonko', 'display');    
    favouritesearch((fav=='none'));  
};


/*****************************************************************************************************************/
/*                                                QR-CODE
/*****************************************************************************************************************/

scanqrcode = function() {    
    //Apro il barcode scanner
    startLoading();
    cordova.plugins.barcodeScanner.scan(
      function (result) {          
          var urlqrcode = result.text;
          setMerchantPreferredByQrCode(request,urlqrcode,function(){
            stopLoading();
            createMessage("Negozio inserito nei preferiti!", function(){});
          });
      }, 
      function (error) {
          errorlog("Errore scansione QR-CODE",error);
      }
   );   
};





/*****************************************************************************************************************/
        
        //sincronizzo tutte le tabelle
        syncall = function(){
            startLoading();
            try{
            synctable(['merchant','message','offer','offer_image','showcase','showcase_image','category','image','event','event_image','credit'], function(){
                syncimages(function(){
                    stopLoading();
                });
            });
            }catch(e){
                errorlog("Errore Sincronizzazione Dati!");
            }        
        };

        //Metodo di reset per debug
        resettable = function(){
            startLoading();
            try{                
                resettablefacade(['merchant','message','offer','offer_image','showcase','showcase_image','category','image','image_sync','event','event_image','credit'], function(){
                    logoutuser();
                        
                });               
            }catch(e){
                errorlog("Errore Sincronizzazione Dati!");
            }  
        }                           
        
        /**
        * Sincronizzazione delle tabelle
        */
        synctable = function(tables,callback) {
            //Recupero i dati da sincronizzare            
            var copytable = new Array();
            var synctable = new Array();
            copytable = copytable.concat(tables);
            getTableDirty(tables,synctable,function(result){
                getTableLastUpdate(copytable,result, function(){   
                    var syncbean = new Object();
                    syncbean.tables = synctable;                    
                    var datajson = json.stringify(syncbean);
                    requestpost(datajson,callback);
                });                
            });                 
        };
    
        /**
        * Metodo di chiamata alla tabella
        */
        requestpost = function(json,callback) {        
            var promise = request.post(url+'FacadeSync/sync',{
                handleAs: "json",
                data: json,
                headers: {
                    "X-Requested-With": null,
                    "Content-Type":"application/json",
                    "token": user.token
                }           
            });            
            promise.response.then(
                function(response) {
                    try{
                        //Controllo se ci sono errori
                        if(response.data.messageList.length>0){
                            errorlog("ERRORE SINCORNIZZAZIONE TABELLE",e);
                        }else{
                            //Aggiorno le tabelle
                            var tables = response.data.objectList;
                            syncTables(tables, callback);                           
                        }                        
                    }catch(e) {
                        errorlog("RESPONSE 101",e);
                    }
                    
                    //Parse della risposta e sincornizzazione delle tabelle locali               
                },
                function(error){
                    errorlog("ERROR SYNC",error); 
                    callback();
                }                     
            );   
        
        };
        
		/**
		 * Metodi di gestione della ProgressBar 
		 * Visibile Durante gli accessi al DB
		 */
		startLoading = function startLoading(){
            //var prog = ProgressIndicator.getInstance();
			
            //dom.byId("ViewApplication").appendChild(prog.domNode);
            //prog.start();
            registry.byId('loading').show();
		};
		
		stopLoading = function stopLoading(){
			//var prog = ProgressIndicator.getInstance();
			//prog.stop();
            registry.byId('loading').hide();
		};	
		
		/**
		 *  Gestione delle date 
		 *  Metodi per la gestione delle date tramite DateSpinner
		 *  Visualizzazione nel formato della variabile 'dateformat'
		 *  
		 *  */
		setDateSpinner = function setDateSpinner() {
            try{
                date = stamp.fromISOString(registry.byId("dateSpinner").get("value"));
                registry.byId(registry.byId("datePicker").get("iddate")).set("rightText",locale.format(date,{selector: "date", formatLength: "short", datePattern:dateformat}));			  
                registry.byId("datePicker").get("callback")(date);
                registry.byId("datePicker").hide();
            }catch(e){
                errorlog("DATESPINNER - 101");
            }
            
	    };
	    	    
	    getDateSpinner = function getDateSpinner(iddate, callback) {
            try{
                registry.byId("datePicker").set("iddate",iddate);
                registry.byId("datePicker").set("callback",callback);
                try{
                    svalue = registry.byId(registry.byId("datePicker").get("iddate")).get("rightText");
                    date = locale.parse(svalue,{selector: "date", formatLength: "short", datePattern:dateformat});
                    registry.byId("dateSpinner").set("value",stamp.toISOString(date));			
                }catch(e){
                    date = new Date();
                    registry.byId("dateSpinner").set("value",stamp.toISOString(date));
                }
                registry.byId("datePicker").show();
             }catch(e){
                errorlog("DATESPINNER - 102");
            }
	    }; 
    
        /**
        * Gestione dei campi numerici
        */
    
        setNumericSpinner = function setDateSpinner() {
            try {
                value = registry.byId("numericPickerLabel").get("label")
                registry.byId(registry.byId("numericPicker").get("idnumeric")).set("rightText",value);	
                registry.byId("numericPicker").get("callback")(parseFloat(value.replace(',','.')));                
                registry.byId("numericPicker").hide();
            }catch(e){
                errorlog("SETNUMERICSPINNER - 100 ",e);
            }
            
	    };
	    	    
	    getNumericSpinner = function getDateSpinner(idnumeric,callback) {
            try {
                registry.byId("numericPicker").set("idnumeric",idnumeric);
                registry.byId("numericPicker").set("callback",callback);
                registry.byId("numericPicker").show();
                try{
                    svalue = registry.byId(registry.byId("numericPicker").get("idnumeric")).get("rightText");
                    registry.byId("numericPickerLabel").set("label",svalue);			
                }catch(e){
                  registry.byId("numericPickerLabel").set("label","");	
                }   
            }catch(e){
                errorlog("GETNUMERICSPINNER - 100 ",e);
            }
	    }; 
            
        addNumberPicker = function addNumberPicker(num){
            try {
                registry.byId("numericPickerLabel").set("label",registry.byId("numericPickerLabel").get("label")+num);
            }catch(e){
                errorlog("ADDNUMBERPICKER - 100 ",e);
            }
        };
        
        addNumericPointer = function addNumericPointer(){
            try{
                registry.byId("numericPickerLabel").set("label",registry.byId("numericPickerLabel").get("label")+",");
            }catch(e){
                errorlog("ADDNUMBERPOINTER - 100 ",e);
            }
        };
        
        cancelNumberPicker = function cancelNumberPicker() {
            try{
                registry.byId("numericPickerLabel").set("label",registry.byId("numericPickerLabel").get("label").substring(0,registry.byId("numericPickerLabel").get("label").length-1));
            }catch(e){
                //Se non esite la stinga
                //Errore gestito
            }
        };
          
        /**
        *Metodi di utilità di gestione della visualizzazione dei bottoni
        *
        */
        hidebutton = function hidebutton(namesb) {
            try{
                domStyle.set(namesb,"display","none");
            }catch(e){
                errorlog("HIDEBUTTON - 100",e);
            }
        };
    
        showbutton = function showbutton(namesb){
            try{
                domStyle.set(namesb,"display","inline-block");
            }catch(e){
                errorlog("SHOWBUTTON - 100",e);
            }
        }
        
        /**
        * Visualizzo la toolbar corrispondente
        */
        showHeadingButton = function showHeadingButton(displayname){
           try{
               
               
               var children = registry.byId('heading').getChildren();
               var arr = array.filter(children, function(w){
                   if(w.id.indexOf('heading_')==0){
                     domStyle.set(displayname,"display","none"); 
                   }
                   if(w.name = displayname){
                     return true;
                   }else{
                    return false;
                   }
                   
               });
               array.forEach(arr, function(item){
                   domStyle.set(item.id,"display","inline-block"); 
               });             
            }catch(e){
                errorlog("SHOWHEADINGBUTTON - 100",e);
            }  
        }
        
        /**
        * Funzione di utilità di gestione degli errori
        */
        errorlog = function errorlog(message, e){
            if(e && e.code){
                alert("ERROR:"+message+" - "+e.code);
            }else{
                alert("ERROR:"+message+" - "+e);
            }
            stopLoading();
        }
        
        
        debuglog = function(message){
            if(debug){
                alert("DEBUG:"+message);
            }
        }
        
        /*Genero UUID*/
        getUUID = function(){
            return dojox.uuid.generateRandomUuid();
        };   
        
        
        /* Creazione Alert di conferma */
        createConfirmation = function(message, callbackok, callbackko) {
            try{
        
                dlg = new SimpleDialog();
                win.body().appendChild(dlg.domNode);
                var msgBox = domConstruct.create("div",
                                         {class: "mblSimpleDialogText",
                                          innerHTML: message},
                                          dlg.domNode);
         
                var noBtn = new Button({class: "mblSimpleDialogButton", innerHTML: "No"});
                noBtn.connect(noBtn.domNode, "click",function(e){callbackko(dlg)});
                noBtn.placeAt(dlg.domNode);

                var yesBtn = new Button({class: "mblSimpleDialogButton mblBlueButton", innerHTML: "Si"});
                yesBtn.connect(yesBtn.domNode, "click",function(e){callbackok(dlg)});
                yesBtn.placeAt(dlg.domNode);         

                dlg.show();  
            }catch(e){
                errorlog("CREATE CONFIRMATION - 100",e);
            }                
        };
        
        /* Creazione messaggio di Avviso */
        createMessage = function(message, callbackok) {
            try{
        
                dlg = new SimpleDialog();
                win.body().appendChild(dlg.domNode);
                var msgBox = domConstruct.create("div",
                                         {class: "mblSimpleDialogText",
                                          innerHTML: message},
                                          dlg.domNode);

                var yesBtn = new Button({class: "mblSimpleDialogButton mblBlueButton", innerHTML: "OK"});
                yesBtn.connect(yesBtn.domNode, "click",function(e){callbackok(dlg)});
                yesBtn.placeAt(dlg.domNode);         

                dlg.show();  
            }catch(e){
                errorlog("CREATE MESSAGE - 100",e);
            }                
        };
        
        /*
        * Login internal
        */
        loginInternal = function(){
            try{
                startLoading();
                login(registry.byId("username").get("value"),registry.byId("password").get("value"));
            }catch(e){
                errorlog("INTERNAL LOGIN ERROR",e);
            }
        };     
        
        /**
        * Effettuo login dell'applicativo
        */
        login = function(username, password) {   
            try{
            startLoading();
            if(username && password){
                //Faccio login online
                var urllogin = url+"Facade/loginUserPasswd?userName="+username+"&password="+password;
                var promise = request.post(urllogin,{
                    handleAs: "json",
                    data: json,
                    headers: {
                        "X-Requested-With": null,
                        "Content-Type":"application/json"                        
                    }           
                });            
                promise.response.then(
                    function(response) {
                        try{
                            //Controllo se ci sono errori
                            if(response.text){
                                
                                var tokentext = response.text.replace(/"/g, "");                                
                                
                                //Effettuo un sync delle tabella utente
                                var objute = new Object();
                                objute.token = tokentext;
                                objute.name = username;
                                user = objute;                               
                                
                                synctable(['utente'],function(){
                                    debuglog("RETRIEVE TOKEN:"+tokentext);
                                    //Recupero l'utente
                                    retrieveToken(tokentext,function(utente){
                                        if(utente){
                                             user = utente
                                            //Vado alla pagina principale dell'applicazione
                                            /* Carico le ultime offerte */
                                            registry.byId("ViewApplication").show(false,false);  
                                            
                                            /* Visualizzo la ricerca */
                                            domStyle.set(registry.byId('filterBoxOffer').domNode, 'display', 'inline');
                                            
                                            
                                            debuglog("SYNC APPLICATION");                                          
                                            //Sincronizzo tabelle di offerte/messaggi/vetrina
                                            synctable(['merchant','message','offer','offer_image','showcase','showcase_image','category','event','event_image','credit','image'], function(){
                                                searchoffer(storepubblicazoni,function(){                            
                                                    registry.byId('list').refresh();                            
                                                    stopLoading();
                                                });
                                                //Carico i messaggi
                                                searchmessage(storemessage,function(){
                                                    registry.byId('listmessage').refresh();  
                                                    stopLoading();
                                                });
                                                
                                                //Carico showcase
                                                getShowcase(user, function(result){
                                                    if(result && result.length>0){
                                                        showcase = result[0];
                                                    }else{
                                                        showcase = new Object();
                                                        showcase.description = '';
                                                    }
                                                }); 
                                                
                                                //Carico le categorie
                                                searchcategory(storecategory,function(){
                                                    registry.byId('listcategory').refresh();  
                                                    stopLoading();
                                                });
                                                                                                
                                                //Carico gli eventi
                                                 searcheventi(storeeventi,function(){
                                                    registry.byId('listeventi').refresh();  
                                                    stopLoading();
                                                });
                                            });
                                        }                           
                                    });                               
                                });                                
                            } else {
                                errorlog("ERRORE LOGIN");
                            }                        
                        }catch(e) {
                            errorlog("RESPONSE 100",e);
                        }
                    },
                    function(error){
                        errorlog("ERROR SYNC",error);            
                    }                     
                );             
            } else {
                //Recupero l'unico utente inserito nella tabella utente
                retrieveToken(null,function(utente){
                    if(utente){
                        user = utente
                        //Vado alla pagina principale dell'applicazione
                        searchoffer(storepubblicazoni,function(){                            
                            registry.byId('list').refresh();                            
                            stopLoading();
                        });
                        //Carico i messaggi
                        searchmessage(storemessage,function(){
                            registry.byId('listmessage').refresh();  
                            stopLoading();
                        });

                        //Carico showcase
                        getShowcase(user, function(result){
                            if(result && result.length>0){
                                showcase = result[0];
                            }else{
                                showcase = new Object();
                                showcase.description = '';
                            }
                        });
                        
                        //Carico le categorie
                        searchcategory(storecategory,function(){
                            registry.byId('listcategory').refresh();  
                            stopLoading();
                        });   
                        
                        //Carico gli eventi
                        searcheventi(storeeventi,function(){
                            registry.byId('listeventi').refresh();  
                            stopLoading();
                        });
                        registry.byId("ViewApplication").show(false,false);
                    }else{
                        stopLoading();
                    }
                });   
            }
            }catch(e){
                errorlog("LOGIN ERROR",e);
            }
        };     
        
        /**
        * Effettuo logout dell'applicativo / anche in modalità offline
        */
        logoutuser = function(){
            deleteconfiguration('LAST_USER_LOG',function(){
                user = null;
                 registry.byId("ViewLogin").show(false,false);    
            });   
        }; 
        
        
        /**
        * Sync delle immagini in background
        */
        syncimages = function(callback) {            
            //Recupero le immagini di cui fare upload
            try{
                getUploadImage(function(uploadimages) {
                    uploadimage(uploadimages, function(){
                        //Recupero le immagini di cui fare download 
                        getDownloadImage(function(downloadimages){
                            downloadimage(downloadimages,function(){
                                if(callback){
                                    callback();        
                                }
                            });
                        });                
                    });
                }); 
            }catch(e){
                errorlog("ERRORE SYNC IMAGE - 100",e);
            }
        };
        
        /**
        * Upload dell'immagine
        */
        uploadimage = function(images,callback) {
            try{
                if(images.length==0){
                    callback();
                    return;
                }            
                var image = images.pop(); 
                fileURI = window.rootimages.toURL()+image.full_path_name;
                
                var options = new FileUploadOptions();
                options.fileKey="file";
                options.fileName=image.full_path_name;
                options.mimeType="image/jpeg";                

                //Upload dell'immagine
                var filetransfer = new FileTransfer();
                filetransfer.upload(fileURI, url+"FacadeSync/upload", function(){

                    //Elimino la riga di upload
                    deleteSyncImage(image,function(){
                        //Chiamo il metodo in ricorsione
                        uploadimage(images,callback);
                    });         
                }, function(){
                    //Errore di upload dell'immgine passo alla successiva
                    uploadimage(images,callback);
                }, options);
            }catch(e){
                errorlog("UPLOAD IMAGE - 100",e);
            }
        }; 
    
        /**
        * Download dell'immagine
        */
        downloadimage = function(images,callback){
            try{
                if(images.length==0){
                    callback();
                    return;
                }            
                var image = images.pop(); 
                fileURI = window.rootimages.toURL()+image.full_path_name;
                   
                //Upload dell'immagine
                var filetransfer = new FileTransfer();                            
                filetransfer.download(url+"FacadeSync/download?pathname="+encodeURI(image.full_path_name), fileURI, function(fileentry){
                    
                    //alert("FILE ENTRY:"+fileentry);
                    
                    //Elimino la riga di upload
                    deleteSyncImage(image,function(){
                        //Chiamo il metodo in ricorsione
                        downloadimage(images,callback);
                    });         
                }, function(error){
                    
                    //console.log("download error source " + error.source);
                    //console.log("download error target " + error.target);
                    //console.log("upload error code" + error.code);
                    
                    //alert("download error source " + error.source);
                    //alert("download error target " + error.target);
                    //alert("upload error code" + error.code);
                    
                    
                    //Errore nel download non cancello l'immagine ma passo alla successiva
                    downloadimage(images,callback);                                         
                });
            }catch(e){
                errorlog("DOWNLOAD IMAGE - 100",e);
            }
        };        
	});