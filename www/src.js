/**
* Variabili globali di utenza
*/
user = null;
debug = false;
url = "http://app.sh1.it/messaging/rest/";
//url = "http://192.168.1.16:8080/messaging/rest/";
urlimage = "http://app.sh1.it/images/";

//Variabile per il messaggio
message = null;
dlg = null;

//Filtro id
actualfilterid = null;

//Massimo numero di righe per pagina
rowforpage = 10;

//ID del Device
deviceID = null;

//News
actualpagenews = 1;
actualobject = null;
favouritenews = true;

//Offerta
actualoffer = null;
actualpageoffer = 1;
favouriteoffer = true;

//Messaggio
actualmessage = null;
actualpagemessage = 1;
favouritemessage = true;

//Evento
actualevent = null;
actualpageevent = 1;
favouriteevent = true;

//Showcase
actualshowcase = null;
actualpageshowcase = 1;
favouriteshowcase = true;

//MerchantID
actualmerchantid = null;

//Flag di caricamento pagina
loadnextpage = false;

//PushNotification
pushNotification = null;

//ChannelName WP8
channelName = '';

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
        var prognews, progoffer, progmessage, progeventi,progshowcase;
        var delItem, handler;
         
        /* Caricamento dinamico dei bottoni */
        showheadingbuttons = function(buttons){
            registry.byId("heading").destroyDescendants();
            for(i=0;i<buttons.length;i++){ 
                registry.byId("heading").addChild(new ToolBarButton(buttons[i]));             
            }               
        } 
        
        storeofferimage = dojo.store.Observable(new Memory({}));
        storeshowcaseimage = dojo.store.Observable(new Memory({}));
        storeeventimage = dojo.store.Observable(new Memory({}));
        
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
            domStyle.set('filterBoxOfferDiv', 'display', 'none');
            domStyle.set('filterBoxMessageDiv', 'display', 'none');
            domStyle.set('filterBoxEventDiv', 'display', 'none');
            domStyle.set('filterBoxShowcaseDiv', 'display', 'none');                        
            
            domStyle.set('headingnews', 'display', 'inline');
            domStyle.set('searchnewsfilterbutton', 'display', 'inline'); 
            domStyle.set('favouritenewsbuttonok', 'display', 'inline'); 
                        
            
            /****************************************************************************
            *   Aggiungo il controllo dei bottoni prima della transazione di apertura   *
            *****************************************************************************/                
            dojo.connect(registry.byId("ViewApplication"), "onBeforeTransitionIn", null, function(){
                showheadingbuttons([]);
                domStyle.set('headinghome', 'display', 'inline');               
            });
                        
            /* OFFERTA */
            dojo.connect(registry.byId("tabOffer"), "onBeforeTransitionIn", null, function(){
                
                domStyle.set('imagelogo', 'display', 'inline');  
                domStyle.set('headingback', 'display', 'none'); 
                
                domStyle.set('headingoffer', 'display', 'inline');   
                
                dom.byId('headingoffer').innerHTML = 'Offerte';   
                
                
                //Nascondo i bottoni
                domStyle.set('searchofferfilterbutton', 'display', 'inline'); 
                if(!favouriteoffer){
                    domStyle.set('favouriteofferbuttonko', 'display', 'inline'); 
                }else{
                    domStyle.set('favouriteofferbuttonok', 'display', 'inline'); 
                }
                
                //Controllo se ha già offerte caricate altrimenti richiamo il metodo
                if(dom.byId('gridoffer').hasChildNodes()){                    
                    startLoading();
                    searchoffer(null,false,favouriteoffer,1,function(){
                        registry.byId("tabOfferbutton").set("badge",undefined);
                        stopLoading();
                    });
                } else if(registry.byId("tabOfferbutton").get("badge")){
                    startLoading();
                    searchoffer(null,false,favouriteoffer,1,function(){
                        //Porto badge a 0
                        registry.byId("tabOfferbutton").set("badge",undefined);
                        stopLoading();
                    });                  
                } else if(actualmerchantid){
                    startLoading();
                    searchoffer(null,false,favouriteoffer,1,function(){
                        //Porto badge a 0
                        registry.byId("tabOfferbutton").set("badge",undefined);
                        stopLoading();
                    }); 
                }
            });
                      
            
            dojo.connect(registry.byId("tabOffer"), "onBeforeTransitionOut", null, function(){
                domStyle.set('headingoffer', 'display', 'none'); 
                domStyle.set('imagelogo', 'display', 'none');  
                
                //Nascondo i bottoni
                domStyle.set('searchofferfilterbutton', 'display', 'none'); 
                domStyle.set('favouriteofferbuttonko', 'display', 'none'); 
                domStyle.set('favouriteofferbuttonok', 'display', 'none'); 
                
            });
            
            dojo.connect(registry.byId("offerdetail"), "onBeforeTransitionIn", null, function(){
                //Creo il dettaglio dell'offerta
                createofferdetail(actualoffer); 
                domStyle.set('headingoffer', 'display', 'inline');    
                domStyle.set('headingback', 'display', 'inline'); 
                
                selectTab('tabinnershowcaseoffer');
                
            });
            
            dojo.connect(registry.byId("offerdetail"), "onBeforeTransitionOut", null, function(){
                //Creo il dettaglio dell'offerta
                domStyle.set('headingoffer', 'display', 'none');     
            });  
            
            /* NEWS */
            dojo.connect(registry.byId("tabNews"), "onBeforeTransitionIn", null, function(){
                domStyle.set('headingnews', 'display', 'inline');   
                domStyle.set('imagelogo', 'display', 'inline');  
                domStyle.set('headingback', 'display', 'none'); 
                
                 //Nascondo i bottoni
                domStyle.set('searchnewsfilterbutton', 'display', 'inline'); 
                if(!favouritenews){
                    domStyle.set('favouritenewsbuttonko', 'display', 'inline'); 
                } else {
                    domStyle.set('favouritenewsbuttonok', 'display', 'inline');                
                }
                            
                if(!dom.byId('gridnews').hasChildNodes()){
                    startLoading();
                    searchnews(null,false,favouritenews,1,function(){
                        registry.byId("tabNewsbutton").set("badge",undefined);
                        stopLoading();
                    });
                }else if(registry.byId("tabNewsbutton").get("badge")){
                    startLoading();
                    searchnews(null,false,favouritenews,1,function(){
                        //Porto badge a 0
                        registry.byId("tabNewsbutton").set("badge",undefined);
                        stopLoading();
                    });                  
                }
            });
            
            dojo.connect(registry.byId("tabNews"), "onBeforeTransitionOut", null, function(){
                domStyle.set('headingnews', 'display', 'none'); 
                domStyle.set('imagelogo', 'display', 'none'); 
                
                
                                
                //Nascondo i bottoni
                domStyle.set('searchnewsfilterbutton', 'display', 'none'); 
                domStyle.set('favouritenewsbuttonko', 'display', 'none'); 
                domStyle.set('favouritenewsbuttonok', 'display', 'none'); 
            });
            
            
            /* MESSAGGIO */
            dojo.connect(registry.byId("tabMessage"), "onBeforeTransitionIn", null, function(){
                domStyle.set('headingmessage', 'display', 'inline'); 
                domStyle.set('imagelogo', 'display', 'inline');  
                domStyle.set('headingback', 'display', 'none'); 
                
                dom.byId('headingmessage').innerHTML = 'Messaggi'; 
                
                domStyle.set('searchmessagefilterbutton', 'display', 'inline'); 
                if(!favouritemessage){
                    domStyle.set('favouritemessagebuttonko', 'display', 'inline'); 
                } else {
                    domStyle.set('favouritemessagebuttonok', 'display', 'inline');  
                }
                
                //Controllo se ha già offerte caricate altrimenti richiamo il metodo
                var children = registry.byId('gridmessage').getChildren();
                if(!children || children.length == 0){
                    startLoading();
                    searchmessage(null,false,favouritemessage,1,function(){
                        registry.byId("tabMessagebutton").set("badge",undefined);
                        stopLoading();
                    });
                }else if(registry.byId("tabMessagebutton").get("badge")){
                    startLoading();
                    searchmessage(null,false,favouritemessage,1,function(){
                        //Porto badge a 0
                        registry.byId("tabMessagebutton").set("badge",undefined);
                        stopLoading();
                    });                  
                } else if(actualmerchantid){
                    startLoading();
                    searchmessage(null,false,favouritemessage,1,function(){
                        //Porto badge a 0
                        registry.byId("tabMessagebutton").set("badge",undefined);
                        stopLoading();
                    }); 
                }              
            });
            
            dojo.connect(registry.byId("tabMessage"), "onBeforeTransitionOut", null, function(){
                domStyle.set('headingmessage', 'display', 'none');  
                domStyle.set('imagelogo', 'display', 'none');  
                
                //Nascondo i bottoni
                domStyle.set('searchmessagefilterbutton', 'display', 'none'); 
                domStyle.set('favouritemessagebuttonko', 'display', 'none'); 
                domStyle.set('favouritemessagebuttonok', 'display', 'none');               
                
            });
                        
            dojo.connect(registry.byId("messagedetail"), "onBeforeTransitionIn", null, function(){
                //Creo il dettaglio dell'offerta
                createmessagedetail(actualmessage); 
                domStyle.set('headingmessage', 'display', 'inline');
                domStyle.set('headingback', 'display', 'inline'); 
            });
            
            dojo.connect(registry.byId("messagedetail"), "onBeforeTransitionOut", null, function(){
                domStyle.set('headingmessage', 'display', 'none'); 
            });           
                         
            /* EVENTI */
            dojo.connect(registry.byId("tabEvent"), "onBeforeTransitionIn", null, function(){
                domStyle.set('headingevent', 'display', 'inline');   
                domStyle.set('imagelogo', 'display', 'inline');  
                domStyle.set('headingback', 'display', 'none'); 
                
                dom.byId('headingevent').innerHTML = 'Eventi'; 
                
                domStyle.set('searcheventfilterbutton', 'display', 'inline');
                
                
                if(!favouriteevent){
                    domStyle.set('favouriteeventbuttonko', 'display', 'inline'); 
                } else {
                    domStyle.set('favouriteeventbuttonok', 'display', 'inline');                 
                }
                
                var children = dom.byId('gridevent').hasChildNodes();
                if(!children){
                    startLoading();
                    searchevent(null,false,favouriteevent,1,function(){
                        stopLoading();
                    });
                }else if(registry.byId("tabEventbutton").get("badge")){
                    startLoading();
                    searchevent(null,false,favouriteevent,1,function(){
                        //Porto badge a 0
                        registry.byId("tabEventbutton").set("badge",undefined);
                        stopLoading();
                    });                  
                } else if(actualmerchantid){
                    startLoading();
                     searchevent(null,false,favouriteevent,1,function(){
                        //Porto badge a 0
                        registry.byId("tabEventbutton").set("badge",undefined);
                        stopLoading();
                    }); 
                }             
            });
            
            dojo.connect(registry.byId("tabEvent"), "onBeforeTransitionOut", null, function(){
                domStyle.set('headingevent', 'display', 'none'); 
                domStyle.set('imagelogo', 'display', 'none');  
                
                domStyle.set('searcheventfilterbutton', 'display', 'none'); 
                domStyle.set('favouriteeventbuttonko', 'display', 'none'); 
                domStyle.set('favouriteeventbuttonok', 'display', 'none');  
                              
            });            
            
            dojo.connect(registry.byId("eventdetail"), "onBeforeTransitionIn", null, function(){
                //Creo il dettaglio dell'offerta
                createeventdetail(actualevent); 
                domStyle.set('headingevent', 'display', 'inline'); 
                domStyle.set('headingback', 'display', 'inline'); 
                selectTab('tabinnershowcaseevent');
            });
            
            dojo.connect(registry.byId("eventdetail"), "onBeforeTransitionOut", null, function(){
                domStyle.set('headingevent', 'display', 'none'); 
            }); 
            
             /* SHOWCASE */
            dojo.connect(registry.byId("tabShowcase"), "onBeforeTransitionIn", null, function(){
                            
                domStyle.set('headingshowcase', 'display', 'inline');   
                domStyle.set('imagelogo', 'display', 'inline');  
                domStyle.set('headingback', 'display', 'none'); 
                
                //Nascondo i bottoni
                domStyle.set('searchshowcasefilterbutton', 'display', 'inline'); 
                if(!favouriteshowcase){
                    domStyle.set('favouriteshowcasebuttonko', 'display', 'inline'); 
                }else{
                    domStyle.set('favouriteshowcasebuttonok', 'display', 'inline'); 
                }
                
                var children = registry.byId('gridshowcase').getChildren();
                if(!children || children.length == 0){
                    startLoading();
                    searchshowcase(null,false,favouriteshowcase,1,function(){
                        stopLoading();
                    });
                }
               
                
            });
            
            dojo.connect(registry.byId("tabShowcase"), "onBeforeTransitionOut", null, function(){
                domStyle.set('headingshowcase', 'display', 'none'); 
                domStyle.set('imagelogo', 'display', 'none');  
                
                //Nascondo i bottoni
                domStyle.set('searchshowcasefilterbutton', 'display', 'none'); 
                domStyle.set('favouriteshowcasebuttonko', 'display', 'none'); 
                domStyle.set('favouriteshowcasebuttonok', 'display', 'none'); 
                
            });
            
            dojo.connect(registry.byId("showcasedetail"), "onBeforeTransitionIn", null, function(){
                //Creo il dettaglio dell'offerta
                createshowcasedetail(); 
                domStyle.set('headingshowcase', 'display', 'inline');  
                domStyle.set('headingback', 'display', 'inline'); 
                selectTab('tabinnershowcaseshowcase');
                
                //Setto il merhcantid
                if(actualobject){
                    actualmerchantid = actualobject.merchantId; 
                }else if(actualshowcase){
                    actualmerchantid = actualshowcase.merchantId; 
                }else if(actualevent){
                    actualmerchantid = actualevent.merchantId; 
                }else if(actualoffer){
                    actualmerchantid = actualoffer.merchantId; 
                }
                            
                //Elimino eventi, offerte e messaggi
                registry.byId('gridoffer').destroyDescendants();
                registry.byId('gridevent').destroyDescendants();
                registry.byId('gridmessage').destroyDescendants();
                                
                //Controllo se il negozio è nei preferiti o no                
                isShowcasePreferred(request,actualmerchantid, function(preferred){
                
                    if(preferred){
                        domStyle.set('favouriteshowcasedetailbuttonko', 'display', 'none');
                        domStyle.set('favouriteshowcasedetailbuttonok', 'display', 'inline');
                    }else{
                        domStyle.set('favouriteshowcasedetailbuttonko', 'display', 'inline');
                        domStyle.set('favouriteshowcasedetailbuttonok', 'display', 'none');
                    }
                });                
                            
            });
            
            dojo.connect(registry.byId("showcasedetail"), "onBeforeTransitionOut", null, function(){
                //Creo il dettaglio dell'offerta
                domStyle.set('headingshowcase', 'display', 'none');                 
                
                domStyle.set('favouriteshowcasedetailbuttonko', 'display', 'none');
                domStyle.set('favouriteshowcasedetailbuttonok', 'display', 'none');
            }); 
            
            
            /* EVENTO DEL CAROUSEL DELLE IMMAGINI */            
            connect.subscribe("/dojox/mobile/carouselSelect", function(carousel, itemWidget, itemObject, index){
                //Visualizzo a tutto schermo l'immagine
                var imgdetailview = registry.byId("imagedetail");            
                                
                srcimage = itemObject.src.replace('_thumb','');
                //dom.byId("imgdetail").src = srcimage;        
                dom.byId("imgdetail").setAttribute('data-original',srcimage);
                                                    
                imgdetailview.show();                           
                $("#imgdetail").lazyload({
                    effect : "fadeIn"
                });
                
            });
                        
            //TODO DA COMMENTARE PER NATIVA
            onDeviceReady(); 
       });
		
        function onDeviceReady() {
                
            //FIX STATUS BAR IOS
            try{
                StatusBar.overlaysWebView(false);
            }catch(e){} 
            
            try{                  
                domStyle.set('sfondo','z-index',-100);                
                                    
            } catch(e) {
                errorlog("ERRORE VIEW APP - 100",e);
            } 
            
            try{     
                //Nascondo lo splah screen
                navigator.splashscreen.hide(); 
            }catch(e) {
                errorlog("ERRORE VIEW APP - 100",e);
            }
                    
            //Attivo il push notification
            try{
                pushNotification = window.plugins.pushNotification;             
            }catch(e){
                errorlog("ERROR PUSH NOTIFICATION!!!",e);
            }
            
            //Setto il deviceinfo
             setTimeout(function(){
                try{
                    //Recupero id del dispositivo
                    deviceID = device.uuid;
                    startLoading();                
                    brand = '';
                    model = device.model;
                    opsystem = device.platform;
                    opversion = device.version;               
                    setDeviceInfo(request,brand,model,opsystem,opversion,null,function(devicebean){

                        //Setto i badge di news, eventi, messaggi, offerte
                        if(devicebean.newsnew && devicebean.newsnew>0){
                            registry.byId("tabNewsbutton").set("badge",devicebean.newsnew);
                        }
                        if(devicebean.eventnew && devicebean.eventnew>0){
                            registry.byId("tabEventbutton").set("badge",devicebean.eventnew);
                        }
                        if(devicebean.messagenew && devicebean.messagenew>0){
                            registry.byId("tabMessagebutton").set("badge",devicebean.messagenew);
                        }
                        if(devicebean.offernew && devicebean.offernew>0){
                            registry.byId("tabOfferbutton").set("badge",devicebean.offernew);
                        }

                        if(!devicebean.tokenPushMessage){
                            registerdevice();
                        }else if(device.platform == "Win32NT"){
                            //In WP8 registro sempre il canale di comunicazione
                             registerdevice();
                        }
                        stopLoading();
                    });
                }catch(e) {
                   //Non faccio nulla e non salvo le preferenze
                    deviceID = 'demo';
                }
                 
                try {                
                    //Inizializzo imgcache
                    ImgCache.init(function(){
                        searchnews(null,false,favouritenews,1); 
                    }, function(){
                        searchnews(null,false,favouritenews,1); 
                    });          
                } catch(e){
                    errorlog("ERROR LOAD NEWS",e);
                }  
             },100);
            
            document.addEventListener("backbutton", onBackKeyDown, false);     
          
        };

/****************************************************************************************************************
*                                   PUSH NOTIFICATION
****************************************************************************************************************/
        
        setBadgeInfo = function(){
            //Setto il deviceinfo
            try{
                //Recupero id del dispositivo
                deviceID = device.uuid;
                brand = '';
                model = device.model;
                opsystem = device.platform;
                opversion = device.version;               
                setDeviceInfo(request,brand,model,opsystem,opversion,null,function(devicebean){
                    
                    //Setto i badge di news, eventi, messaggi, offerte
                    if(devicebean.newsnew && devicebean.newsnew>0){                        
                        var badge1 = registry.byId("tabNewsbutton").get("badge");
                        if(badge1){
                            registry.byId("tabNewsbutton").set("badge",parseInt(badge1)+devicebean.newsnew);
                        }else{
                            registry.byId("tabNewsbutton").set("badge",devicebean.newsnew);
                        }                      
                    }
                    
                    if(devicebean.eventnew && devicebean.eventnew>0){
                        var badge2 = registry.byId("tabEventbutton").get("badge");
                        if(badge2){
                             registry.byId("tabEventbutton").set("badge",parseInt(badge2)+devicebean.eventnew);
                        }else{
                             registry.byId("tabEventbutton").set("badge",devicebean.eventnew);
                        }                      
                    }
                    
                    if(devicebean.messagenew && devicebean.messagenew>0){
                        var badge3 = registry.byId("tabMessagebutton").get("badge");
                        if(badge3){
                             registry.byId("tabMessagebutton").set("badge",parseInt(badge3)+devicebean.messagenew);
                        }else{
                             registry.byId("tabMessagebutton").set("badge",devicebean.messagenew);
                        }
                    }
                    
                    if(devicebean.offernew && devicebean.offernew>0){
                        var badge4 = registry.byId("tabOfferbutton").get("badge");
                        if(badge4){
                             registry.byId("tabOfferbutton").set("badge",parseInt(badge4)+devicebean.offernew);
                        }else{
                             registry.byId("tabOfferbutton").set("badge",devicebean.offernew);
                        }
                    } 
                });
            }catch(e) {
               //Non faccio nulla e non salvo le preferenze
                deviceID = 'demo';
            }         
        };



        registerdevice = function() {
            startLoading();
            if (device.platform == 'android' || device.platform == 'Android'){
                pushNotification.register(
                successHandler,
                errorHandler,
                {
                    "senderID":"1035210567078",
                    "ecb":"onNotificationAndroid"
                });
            } else if(device.platform == "Win32NT"){
                pushNotification.register(
                    channelHandler,
                    errorHandler,
                    {
                        "channelName": deviceID,
                        "ecb": "onNotificationWP8",
                        "uccb": "channelHandler",
                        "errcb": "jsonErrorHandler"
                    });
            } else  {
                pushNotification.register(
                tokenHandler,
                errorHandler,
                {
                    "badge":"true",
                    "sound":"true",
                    "alert":"true",
                    "ecb":"onNotificationIOS"
                });
            }     
        };

        //result contains any message sent from the plugin call
        successHandler = function(result) {
            //Non fa nulla resituisce solo OK - KO
            stopLoading();
        };

        errorHandler = function(error) {
            //errorlog("ERROR",error);
            //Error unregister WP8;
        };

        //Notifiche IOS
        onNotificationIOS = function (event) {
            setBadgeInfo();            
        };
        
        //Notifica ANDROID
        onNotificationAndroid = function(e) {
            stopLoading();
            switch(e.event){
                case 'registered':
                    if ( e.regid.length > 0 ) {
                        //Effettuo la registrazione del dispositivo
                        deviceID = device.uuid;
                        startLoading();                
                        brand = '';
                        model = device.model;
                        opsystem = device.platform;
                        opversion = device.version;               
                        setDeviceInfo(request,brand,model,opsystem,opversion,e.regid,function(){
                            stopLoading();
                        });                   
                    }
                break;

                case 'message':
                    if (e.foreground) {
                        //Applicazione è visibile 
                        setBadgeInfo();
                    }
                break;

            case 'error':
                errolog("ERRORE NOTIFICA ",e.msg);
            break;

            default:
                //Non faccio nulla
            break;
          }
        };
        
        //Notifica WP8
        onNotificationWP8 = function(e) {
            setBadgeInfo();
        }
        
        //WP8
        channelHandler = function(e){
            if ( e.uri.length > 0 ) {
                   //Effettuo la registrazione del dispositivo
                   deviceID = device.uuid;
                   startLoading();                
                   brand = '';
                   model = device.model;
                   opsystem = device.platform;
                   opversion = device.version;               
                   setDeviceInfo(request,brand,model,opsystem,opversion,e.uri,function(){
                        stopLoading();
                   });                   
         }       
        }
        
        //WP8
        jsonErrorHandler = function(error){
            alert(error.code+" - "+error.message);  
            stopLoading();
        }        

        //Token IOS
        tokenHandler = function(result) {
             //Effettuo la registrazione del dispositivo
             deviceID = device.uuid;
             startLoading();                
             brand = '';
             model = device.model;
             opsystem = device.platform;
             opversion = device.version;               
             setDeviceInfo(request,brand,model,opsystem,opversion,result,function(){
                   stopLoading();
             });  
        };

/***************************************************************************************************************************/

    
        onBackKeyDown = function(e){
           createConfirmation("Sei sicuro di uscire da Shooopit?", 
            function(){
               //Effettuo deregistrazione url di push solo per WP8
               if(device.platform == "Win32NT"){
                    pushNotification.unregister(successHandler, errorHandler);
               }                             
               navigator.app.exitApp(); 
            }, 
            function(dlg){
               dlg.hide();
               dlg.destroyRecursive(false);         
            }); 
        };
              
        /* Funzione di pull per sincronizzare le news */
        onPullNews = function(view, y, h){
          dom.byId("msg1news").innerHTML = percent < 100 ? "Tira per aggiornare le news" : "Rilascia per aggiornare le news";
          y = y > h ? h : y;
          var percent = y / h * 100;
          var deg = -1.8 * percent + 360;
          dom.byId("iconnews").style.webkitTransform = "rotate(" + deg + "deg)";
        };
        
        /* Funzione di Pulled per sincronizzare */
        onPulledNews = function(view){
          if(!prognews){
					prognews = new ProgressIndicator({size:20, center:false});
            }
			if(prognews.timer){ return; }
			dom.byId("iconnews").style.display = "none";
			dom.byId("msg1news").innerHTML = "Attendere...";
			dom.byId("prognews").appendChild(prognews.domNode);
			prognews.start();
             
            var value = dom.byId('filterBoxNews').value;
            searchnews(value,false,favouritenews,1,function(){
                registry.byId("tabNews").slideTo({y:0}, 0.3, "ease-out");
                prognews.stop();
                dom.byId("iconnews").style.display = "inline";
                registry.byId("tabNewsbutton").set("badge",undefined);
                stopLoading();
            });                      
         };

        /* Funzione di pull per sincronizzare delle offerte */
         onPullOffer = function(view, y, h){
          dom.byId("msg1offer").innerHTML = percent < 100 ? "Tira per aggiornare le offerte" : "Rilascia per aggiornare le offerte";
          y = y > h ? h : y;
          var percent = y / h * 100;
          var deg = -1.8 * percent + 360;
          dom.byId("iconoffer").style.webkitTransform = "rotate(" + deg + "deg)";
        };
        
        /* Funzione di Pulled per sincronizzare */
        onPulledOffer = function(view){
          if(!progoffer){
					progoffer = new ProgressIndicator({size:20, center:false});
            }
			if(progoffer.timer){ return; }
			dom.byId("iconoffer").style.display = "none";
			dom.byId("msg1offer").innerHTML = "Attendere...";
			dom.byId("progoffer").appendChild(progoffer.domNode);
			progoffer.start();
                    
            var value = dom.byId('filterBoxOffer').value;
            searchoffer(value,false,favouriteoffer,1,function(){
                registry.byId("tabOffer").slideTo({y:0}, 0.3, "ease-out");
                progoffer.stop();
                dom.byId("iconoffer").style.display = "inline"; 
                registry.byId("tabOfferbutton").set("badge",undefined);
                stopLoading();
            });                      
         };

        /* Funzione di pull per sincronizzare degli eventi */
         onPullEvent = function(view, y, h){
          dom.byId("msg1event").innerHTML = percent < 100 ? "Tira per aggiornare gli eventi" : "Rilascia per aggiornare gli eventi";
          y = y > h ? h : y;
          var percent = y / h * 100;
          var deg = -1.8 * percent + 360;
          dom.byId("iconevent").style.webkitTransform = "rotate(" + deg + "deg)";
        };
        
        /* Funzione di Pulled per sincronizzare */
        onPulledEvent = function(view){
          if(!progevent){
					progevent = new ProgressIndicator({size:20, center:false});
            }
			if(progevent.timer){ return; }
			dom.byId("iconevent").style.display = "none";
			dom.byId("msg1event").innerHTML = "Attendere...";
			dom.byId("progevent").appendChild(progevent.domNode);
			progevent.start();
             
            var value = dom.byId('filterBoxEvent').value;
            searchevent(value,false,false,1,function(){
                registry.byId("tabEvent").slideTo({y:0}, 0.3, "ease-out");
                progevent.stop();
                dom.byId("iconevent").style.display = "inline"; 
                registry.byId("tabEventbutton").set("badge",undefined);
                stopLoading();
            });                      
         };


        /* Funzione di pull per sincronizzare degli eventi */
         onPullMessage = function(view, y, h){
          dom.byId("msg1message").innerHTML = percent < 100 ? "Tira per aggiornare i messaggi" : "Rilascia per aggiornare i messaggi";
          y = y > h ? h : y;
          var percent = y / h * 100;
          var deg = -1.8 * percent + 360;
          dom.byId("iconmessage").style.webkitTransform = "rotate(" + deg + "deg)";
        };
        
        /* Funzione di Pulled per sincronizzare */
        onPulledMessage = function(view){
          if(!progmessage){
					progmessage = new ProgressIndicator({size:20, center:false});
            }
			if(progmessage.timer){ return; }
			dom.byId("iconmessage").style.display = "none";
			dom.byId("msg1message").innerHTML = "Attendere...";
			dom.byId("progmessage").appendChild(progmessage.domNode);
			progmessage.start();
             
            var value = dom.byId('filterBoxMessage').value;
            searchmessage(value,false,false,1,function(){
                registry.byId("tabMessage").slideTo({y:0}, 0.3, "ease-out");
                progmessage.stop();
                dom.byId("iconmessage").style.display = "inline"; 
                registry.byId("tabMessagebutton").set("badge",undefined);
                stopLoading();
            });                      
         };


         /* Funzione di pull per sincronizzare delle Vetrine */
         onPullShowcase = function(view, y, h){
          dom.byId("msg1showcase").innerHTML = percent < 100 ? "Tira per aggiornare le vetrine" : "Rilascia per aggiornare le vetrine";
          y = y > h ? h : y;
          var percent = y / h * 100;
          var deg = -1.8 * percent + 360;
          dom.byId("iconshowcase").style.webkitTransform = "rotate(" + deg + "deg)";
        };
        
        /* Funzione di Pulled per sincronizzare */
        onPulledShowcase = function(view){
          if(!progshowcase){
					progshowcase = new ProgressIndicator({size:20, center:false});
            }
			if(progshowcase.timer){ return; }
			dom.byId("iconshowcase").style.display = "none";
			dom.byId("msg1showcase").innerHTML = "Attendere...";
			dom.byId("progshowcase").appendChild(progshowcase.domNode);
			progshowcase.start();
             
            var value = dom.byId('filterBoxShowcase').value;
            searchshowcase(value,false,false,1,function(){
                registry.byId("tabShowcase").slideTo({y:0}, 0.3, "ease-out");
                progshowcase.stop();
                dom.byId("iconshowcase").style.display = "inline"; 
            });                      
         };

        
/****************************************************************************************************************
*                                   METODI GENERALI
****************************************************************************************************************/

selectTab = function(idmess) {
    try{
        registry.byId(idmess).set("selected",true);    
        var ragsoc = "";
        if(actualobject){
            ragsoc = actualobject.ragSoc;
        }else if(actualshowcase){
            ragsoc = actualshowcase.ragSoc;
        }

        if(idmess=='tabOfferbutton') {
            dom.byId("headingoffer").innerHTML = "Offerte "+ragsoc;        
            domStyle.set('favouriteofferbuttonko','display','none');
            domStyle.set('favouriteofferbuttonok','display','none');        
        } else if(idmess=='tabEventbutton') {
            dom.byId("headingevent").innerHTML = "Eventi "+ragsoc;
            domStyle.set('favouriteeventbuttonko','display','none');
            domStyle.set('favouriteeventbuttonok','display','none');
        } else if(idmess=='tabMessagebutton') {
            dom.byId("headingmessage").innerHTML = "Messaggi "+ragsoc;
            domStyle.set('favouritemessagebuttonko','display','none');
            domStyle.set('favouritemessagebuttonok','display','none');
        }
    }catch(e){
        alert(e);
    }
};

hideback = function(){
    domStyle.set('headingback', 'display', 'none');
};

/****************************************************************************************************************
*                                   NEWS
****************************************************************************************************************/

searchnews = function(filter,append,favourite,page,callback){
    //Carico le News    
    startLoading();    
    actualpagenews = page;   
    getNews(request,json,filter,favourite,page,function(news){
        
        var gridnews = dom.byId("gridnews");
        
        //Elimino le vecchie news
        if(!append){
            //gridnews.destroyDescendants(); 
            try{
                while (gridnews.hasChildNodes()) {
                    gridnews.removeChild(gridnews.lastChild);
                }
            }catch(e){
                alert(e);
            }
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
                        if(news[i].description.length>25){
                            html = news[i].description.substring(0,22)+"...";
                        }else{
                            html = news[i].description;
                        }                      
                    }
                }else if(object_type=='E'){
                    //Eventi
                    html = news[i].title;
                } 
                
                if(html){
                    pane = new Pane(); 
                    //pane.set("class","effect8");
                    pane.set("bean",news[i]);
                    pane.on("click",function(){opendetailnews(this.id)});
                                        
                    var msgBox = domConstruct.create("div", {class: "innerPane effect8"}, pane.domNode);
                    if(object_type != 'M'){
                        var srcimage = urlimage+news[i].fullPathName;
                        
                        var splitarray = srcimage.split('.');
                        //Recupero il thumb
                        srcimage =  srcimage.replace("."+splitarray[splitarray.length-1],"_thumb."+splitarray[splitarray.length-1]);
                                   
                        var imgBox = domConstruct.create("img", {class:"innerPaneImg"}, msgBox);
                        
                        imgBox.setAttribute('data-original',srcimage);
                        
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
                    
                    if(object_type=='M'){
                        var iconBox = domConstruct.create("label", {class:'icon ion-email icon-mess-color', style:"font-size:60px"}, msgBox);
                    }               
                    
                    var labelBox = domConstruct.create("span", {innerHTML: html}, msgBox);
                                    
                    gridnews.appendChild(pane.domNode); 
                    pane.startup();
                }                    
            }catch(e){
                errorlog("SEARCH NEWS",e);
            }
        } 
      
        $("#gridnews .innerPaneImg").lazyload({
            effect : "fadeIn",
            container: $("#gridnews"),
            failure_limit:999
        });
        
        
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
        actualoffer = news; 
        registry.byId("tabNews").performTransition("offerdetail", 1, "slide");
         registry.byId("headingback").set("moveTo","tabNews");
    }else if(news.objectType=='E'){
        //Apro il dettaglio dell'evento
        actualevent = news; 
        registry.byId("tabNews").performTransition("eventdetail", 1, "slide"); 
        registry.byId("headingback").set("moveTo","tabNews");
    }else if(news.objectType=='M'){
        //Apro il dettaglio del messaggio
        actualmessage = news; 
        registry.byId("tabNews").performTransition("messagedetail", 1, "slide"); 
        registry.byId("headingback").set("moveTo","tabNews");
    }
};

favouritesearchnews = function(favourite) {    
    var value = dom.byId('filterBoxNews').value;
    favouritenews = favourite;
    if(favourite) {
    //Controllo lo stato dei preferiti
        domStyle.set('favouritenewsbuttonko', 'display','none');
        domStyle.set('favouritenewsbuttonok', 'display','inline');
        searchnews(value,false,true,1);
    
    } else {
        domStyle.set('favouritenewsbuttonko', 'display','inline');
        domStyle.set('favouritenewsbuttonok', 'display','none');
        searchnews(value,false,false,1);
    }
};

searchnewsfilter = function(){
    favouritesearchnews(favouritenews);  
};

pagingNews = function(e){
   if(e.afterBottom && !loadnextpage) {
       loadnextpage = true;
       
       //Effettuo la chiamata alla pagina successica
       startLoading();
       
       //Calcolo il numero di pagina da visualizzare
       favouritesearchnews(favouritenews);  
              
       var value = dom.byId('filterBoxNews').value;;    
       searchnews(value,true,favouritenews,(actualpagenews+1), function(){
           loadnextpage = false;
           stopLoading();
       });
       
   }
};


 opensearchnews = function(){        
        var type = domStyle.get('filterBoxNewsDiv', 'display');
        if(type=='none'){
            domStyle.set('filterBoxNewsDiv', 'display', 'block');
        }else{
            domStyle.set('filterBoxNewsDiv', 'display', 'none');
            dom.byId('filterBoxNews').value = null;
        }
};


/*****************************************************************************************************************/
/*                                                OFFERTE 
/*****************************************************************************************************************/

searchoffer = function(filter,append,favourite,page,callback){
    //Carico le News    
    startLoading();    
    actualpageoffer = page;  
    
    merchantid = actualmerchantid;
    
    getOffer(request,json,filter,merchantid,favourite,page,function(offers){
        
        var gridoffer = dom.byId("gridoffer");
        
        //Elimino le vecchie news
        if(!append){
            try{
                while (gridoffer.hasChildNodes()) {
                    gridoffer.removeChild(gridoffer.lastChild);
                }
            }catch(e){
                alert(e);
            }   
        }
        
        //Ciclo le news 
        for(i=0;i<offers.length;i++){                        
            //Aggiungo i Pane e carico le immagini
            try{  
                var html = offers[i].title;
                                
                if(html){
                    pane = new Pane();                                       
                    pane.set("bean",offers[i]);
                    pane.on("click",function(){opendetailoffer(this.id)});
                                        
                    var msgBox = domConstruct.create("div", {class: "innerPane effect8"}, pane.domNode);
                    var srcimage = urlimage+offers[i].fullPathName;
                            
                    var splitarray = srcimage.split('.');
                    //Recupero il thumb
                    srcimage =  srcimage.replace("."+splitarray[splitarray.length-1],"_thumb."+splitarray[splitarray.length-1]);
                    
                    var imgBox = domConstruct.create("img", {class:"innerPaneImg"}, msgBox);
                    imgBox.setAttribute('data-original',srcimage);
                    
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
                    
                    var labelBox = domConstruct.create("span", {innerHTML: html}, msgBox);
                    gridoffer.appendChild(pane.domNode);
                    pane.startup();
                }                    
            }catch(e){
                errorlog("SEARCH OFFERS",e);
            }
        } 
        
        $("#gridoffer .innerPaneImg").lazyload({
            effect : "fadeIn",
            container: $("#gridoffer"),
            failure_limit:999
        });
        
        stopLoading();
        if(callback){
            callback();
        }
    });      
};

opendetailoffer = function(id) {
   actualoffer = registry.byId(id).get("bean");  
   //Apro il dettaglio dell'offerta
   registry.byId("tabOffer").performTransition("offerdetail", 1, "slide"); 
    registry.byId("headingback").set("moveTo","tabOffer");
};


favouritesearchoffer = function(favourite) {    
    var value = dom.byId('filterBoxOffer').value;
    favouriteoffer = favourite;
    if(favourite) {
    //Controllo lo stato dei preferiti
        if(!actualmerchantid){
            domStyle.set('favouriteofferbuttonko', 'display','none');
            domStyle.set('favouriteofferbuttonok', 'display','inline');
        }
        searchoffer(value,false,true,1);    
    } else {
         if(!actualmerchantid){
            domStyle.set('favouriteofferbuttonko', 'display','inline');
            domStyle.set('favouriteofferbuttonok', 'display','none');
         }
        searchoffer(value,false,false,1);
    }
};

searchofferfilter = function(){
    favouritesearchoffer(favouriteoffer);  
};

controllOfferTab = function(){
    if(actualmerchantid){
        actualmerchantid = null; 
        actualobject=null;
        favouritesearchoffer(favouriteoffer); 
        dom.byId('headingoffer').innerHTML = 'Offerte';
    }
};

pagingOffer = function(e){
   if(e.afterBottom && !loadnextpage) {
       loadnextpage = true;
       
       //Effettuo la chiamata alla pagina successica
       startLoading();
       
       //Calcolo il numero di pagina da visualizzare
       favouritesearchoffer(favouriteoffer);  
              
       var value = dom.byId('filterBoxOffer').value;    
       searchoffer(value,true,favouriteoffer,(actualpageoffer+1), function(){
           loadnextpage = false;
           stopLoading();
       });      
   }
};

createofferdetail = function(){
    //Elimino la vecchia visualizzazione
    detailoffer = registry.byId("offerdetail");
    
    //Elimino il vecchio panello
    if( registry.byId("paneofferdetail")){
        registry.byId("paneofferdetail").destroyRecursive(false);
    }
    
    offer = actualoffer;
        
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
    
    objectId = offer.objectId;
    if(!objectId){
        objectId = offer.offerId;
    }
    
    //Recupero le immagini dell'offerta
    getOfferImages(request,objectId,function(images){         
        var imgs = new Array();
        for(i=0;i<images.length;i++) {
            var srcimage = images[i].fullPathName;  
            var splitarray = srcimage.split('.');
            //Recupero il thumb
            srcimage =  srcimage.replace("."+splitarray[splitarray.length-1],"_thumb."+splitarray[splitarray.length-1]);               
            var obj = new Object();
            obj.src = srcimage;  
            imgs.push(obj);                     
        }
        storeofferimage.setData(imgs);
        registry.byId("carouselofferimage").refresh();
    });
};


 opensearchoffer = function(){        
        var type = domStyle.get('filterBoxOfferDiv', 'display');
        if(type=='none'){
            domStyle.set('filterBoxOfferDiv', 'display', 'block');
        }else{
            domStyle.set('filterBoxOfferDiv', 'display', 'none');
            dom.byId('filterBoxOffer').value = null;
        }
      
};


/*****************************************************************************************************************/
/*                                                EVENTI 
/*****************************************************************************************************************/

searchevent = function(filter,append,favourite,page,callback){
    //Carico le News    
    startLoading();    
    actualpageevent = page;
    merchantid = actualmerchantid;
    
    
    
    getEvent(request,json,filter,merchantid,favourite,page,function(events){
        
        var gridevent = dom.byId("gridevent");
        
        //Elimino le vecchie news
        if(!append){
            try{
                while (gridevent.hasChildNodes()) {
                    gridevent.removeChild(gridevent.lastChild);
                }
            }catch(e){
                alert(e);
            }  
        }
        
        //Ciclo le news 
        for(i=0;i<events.length;i++){                        
            //Aggiungo i Pane e carico le immagini
            try{  
                var html = events[i].title;
                                
                if(html){
                    pane = new Pane();                                       
                    pane.set("bean",events[i]);
                    pane.on("click",function(){opendetailevent(this.id)});
                                        
                    var msgBox = domConstruct.create("div", {class: "innerPane effect8"}, pane.domNode);
                    var srcimage = urlimage+events[i].fullPathName;
                    var splitarray = srcimage.split('.');
                    //Recupero il thumb
                    srcimage =  srcimage.replace("."+splitarray[splitarray.length-1],"_thumb."+splitarray[splitarray.length-1]);
                    
                    var imgBox = domConstruct.create("img", {class:"innerPaneImg"}, msgBox);
                    imgBox.setAttribute('data-original',srcimage);
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
                    
                    var labelBox = domConstruct.create("span", {innerHTML: html}, msgBox);
                    gridevent.appendChild(pane.domNode);
                    pane.startup();
                }                    
            }catch(e){
                errorlog("SEARCH EVENTS",e);
            }
        } 
        
        $("#gridevent .innerPaneImg").lazyload({
            effect : "fadeIn",
            container: $("#gridevent"),
            failure_limit:999
        });
        
        stopLoading();
        if(callback){
            callback();
        }
    });      
};

opendetailevent = function(id) {
   actualevent = registry.byId(id).get("bean");  
   //Apro il dettaglio del evento
   registry.byId("tabEvent").performTransition("eventdetail", 1, "slide");  
    registry.byId("headingback").set("moveTo","tabEvent");
};


favouritesearchevent = function(favourite) {  
    var value = dom.byId('filterBoxEvent').value;
    favouriteevent = favourite;
    if(favouriteevent) {
        if(!actualmerchantid){
            //Controllo lo stato dei preferiti
            domStyle.set('favouriteeventbuttonko', 'display','none');
            domStyle.set('favouriteeventbuttonok', 'display','inline');
        }
        searchevent(value,false,true,1);    
    } else {
        if(!actualmerchantid){
            domStyle.set('favouriteeventbuttonko', 'display','inline');
            domStyle.set('favouriteeventbuttonok', 'display','none');
        }
        searchevent(value,false,false,1);
    }
};

searcheventfilter = function() {
    favouritesearchevent(favouriteevent);  
};

controllEventTab = function(){
    if(actualmerchantid){
        actualmerchantid = null; 
        actualobject=null;
        favouritesearchevent(favouriteevent);
        dom.byId('headingevent').innerHTML = 'Eventi';
    }
};


pagingEvent = function(e){
   if(e.afterBottom && !loadnextpage) {
       loadnextpage = true;
       
       //Effettuo la chiamata alla pagina successica
       startLoading();
       
       //Calcolo il numero di pagina da visualizzare
       favouritesearchevent(favouriteevent);  
              
       var value = dom.byId('filterBoxEvent').value;    
       searchevent(value,true,favouriteevent,(actualpageevent+1), function(){
           loadnextpage = false;
           stopLoading();
       });      
   }
};

createeventdetail = function(){
    //Elimino la vecchia visualizzazione
    detailevent = registry.byId("eventdetail");
    
    //Elimino il vecchio panello
    if( registry.byId("paneeventdetail")){
        registry.byId("paneeventdetail").destroyRecursive(false);
    }
    
    event = actualevent;
        
    //Creo il pannello
    pane = new Pane({id:"paneeventdetail"});
    
    //Controllo date dell'offerte
    msgdate = "Evento valido ";
    if(event.dateFrom) {
        msgdate += ' dal '+locale.format(new Date(event.dateFrom),{selector: "date", formatLength: "short", datePattern:dateformat});
    }
    
    if(event.dateTo){
        msgdate += ' fino al '+locale.format(new Date(event.dateTo),{selector: "date", formatLength: "short", datePattern:dateformat});
    }  
    
    if(event.ragSoc){
        msgdate += "</br>"+event.ragSoc;
    }
    
    if(event.title){
        msgdate += "</br>"+event.title;
    }
                
    var msgBox = domConstruct.create("div", {class: "innerPaneDetail", innerHTML:msgdate}, pane.domNode);    
    detailevent.addChild(pane,0);  
        
    // Visualizzo la descrizione dell'offerta
    if( registry.byId("paneeventdetailhtml")){
        registry.byId("paneeventdetailhtml").destroyRecursive(false);
    }
    
    //Creo il pannello
    panehtml = new Pane({id:"paneeventdetailhtml"});
    var msgBoxhtml = domConstruct.create("div", {class: "innerPaneDetail", innerHTML:event.description}, panehtml.domNode);    
    detailevent.addChild(panehtml);
    
    objectId = event.objectId;
    if(!objectId){
        objectId = event.eventId;
    }
    
    //Recupero le immagini dell'offerta
    getEventImages(request,objectId,function(images){         
        var imgs = new Array();
        for(i=0;i<images.length;i++) {
            var srcimage = images[i].fullPathName;
            var obj = new Object();
            obj.src = srcimage;  
            imgs.push(obj);                     
        }
        storeeventimage.setData(imgs);
        registry.byId("carouseleventimage").refresh();
    });
};


 opensearchevent = function(){        
        var type = domStyle.get('filterBoxEventDiv', 'display');
        if(type=='none'){
            domStyle.set('filterBoxEventDiv', 'display', 'block');
        }else{
            domStyle.set('filterBoxEventDiv', 'display', 'none');
            dom.byId('filterBoxEvent').value=null;
        }
};


/*****************************************************************************************************************/
/*                                                MESSAGGI 
/*****************************************************************************************************************/

searchmessage = function(filter,append,favourite,page,callback){
    //Carico le News    
    startLoading();    
    actualpagemessage = page;
    
     merchantid = actualmerchantid;
    
    getMessage(request,json,filter,merchantid,favourite,page,function(messages){
        
        var gridmessage = dom.byId("gridmessage");
        
        //Elimino le vecchie news
        if(!append){
            try{
                while (gridevent.hasChildNodes()) {
                    gridevent.removeChild(gridevent.lastChild);
                }
            }catch(e){
                alert(e);
            }      
        }
        
        //Ciclo i messaggi 
        for(i=0;i<messages.length;i++){                        
            //Aggiungo i Pane ed inserisco il messaggio
            try{  
                var html = messages[i].description;
                                
                if(html){
                    
                    if(html.length>25){
                       html = html.substring(0,22)+"...";
                    }
                                    
                    pane = new Pane();                                       
                    pane.set("bean",messages[i]);
                    pane.on("click",function(){opendetailmessage(this.id)});
                                        
                    var msgBox = domConstruct.create("div", {class: "innerPane effect8"}, pane.domNode);
                    
                     var iconBox = domConstruct.create("label", {class:'icon ion-email icon-mess-color', style:"font-size:60px"}, msgBox);
                    
                    
                    var labelBox = domConstruct.create("span", {innerHTML: html}, msgBox);
                    gridmessage.appendChild(pane.domNode);
                    pane.startup();
                }                    
            }catch(e){
                errorlog("SEARCH MESSAGES",e);
            }
        } 
        stopLoading();
        if(callback){
            callback();
        }
    });      
};

opendetailmessage = function(id) {
   actualmessage = registry.byId(id).get("bean");  
   //Apro il dettaglio del evento
   registry.byId("tabMessage").performTransition("messagedetail", 1, "slide");    
    registry.byId("headingback").set("moveTo","tabMessage");
};


favouritesearchmessage = function(favourite) {    
    var value = dom.byId('filterBoxMessage').value;
    favouritemessage = favourite;
    if(favourite) {
        if(actualmerchantid){
            //Controllo lo stato dei preferiti
            domStyle.set('favouritemessagebuttonko', 'display','none');
            domStyle.set('favouritemessagebuttonok', 'display','inline');
        }
        searchmessage(value,false,true,1);    
    } else {
        if(actualmerchantid){
            domStyle.set('favouritemessagebuttonko', 'display','inline');
            domStyle.set('favouritemessagebuttonok', 'display','none');
        }
        searchmessage(value,false,false,1);
    }
};

searchmessagefilter = function() {
    favouritesearchmessage(favouritemessage);  
};

controllMessageTab = function(){
    if(actualmerchantid){
        actualmerchantid = null; 
        actualobject=null;
        favouritesearchmessage(favouritemessage); 
        dom.byId('headingmessage').innerHTML = 'Messaggi';
    }
};

pagingMessage = function(e){
   if(e.afterBottom && !loadnextpage) {
       loadnextpage = true;
       
       //Effettuo la chiamata alla pagina successica
       startLoading();
       
       //Calcolo il numero di pagina da visualizzare
       favouritesearchmessage(favouritemessage);  
              
       var value = dom.byId('filterBoxEvent').value;    
       searchmessage(value,true,favouritemessage,(actualpagemessage+1), function(){
           loadnextpage = false;
           stopLoading();
       });      
   }
};

createmessagedetail = function(){
    //Elimino la vecchia visualizzazione
    detailmessage = registry.byId("messagedetail");
  
    message = actualmessage;
         
    // Visualizzo la descrizione del messaggio
    if(registry.byId("panemessagedetailhtml")){
       registry.byId("panemessagedetailhtml").destroyRecursive(false);
    } 
    //Creo il pannello
    panehtml = new Pane({id:"panemessagedetailhtml"});
    var msgBoxhtml = domConstruct.create("div", {class: "innerPaneDetail", innerHTML:message.description}, panehtml.domNode);    
    detailmessage.addChild(panehtml);
};

 opensearchmessage = function(){        
        var type = domStyle.get('filterBoxMessageDiv', 'display');
        if(type=='none'){
            domStyle.set('filterBoxMessageDiv', 'display', 'block');
        }else{
            domStyle.set('filterBoxMessageDiv', 'display', 'none');
            dom.byId('filterBoxMessage').value =null;
        }
};



/*****************************************************************************************************************/
/*                                                SHOWCASE 
/*****************************************************************************************************************/

searchshowcase = function(filter,append,favourite,page,callback){
    //Carico le News    
    startLoading();    
    actualpageshowcase = page;   
    getShowcase(request,json,filter,favourite,page,function(showcases){
        
        var gridshowcase = dom.byId("gridshowcase");
        
        //Elimino le vecchie news
        if(!append){
             try{
                while (gridshowcase.hasChildNodes()) {
                    gridshowcase.removeChild(gridshowcase.lastChild);
                }
            }catch(e){
                alert(e);
            }     
        }
        
        //Ciclo le news 
        for(i=0;i<showcases.length;i++){                        
            //Aggiungo i Pane e carico le immagini
            try{  
                var html = showcases[i].ragSoc;
                                
                if(html){
                    pane = new Pane();                                       
                    pane.set("bean",showcases[i]);
                    pane.on("click",function(){opendetailshowcase(this.id)});
                                        
                    var msgBox = domConstruct.create("div", {class: "innerPane effect8"}, pane.domNode);
                    var srcimage = urlimage+showcases[i].fullPathName;
                     var splitarray = srcimage.split('.');
                    //Recupero il thumb
                    srcimage =  srcimage.replace("."+splitarray[splitarray.length-1],"_thumb."+splitarray[splitarray.length-1]);
                    
                    var imgBox = domConstruct.create("img", {class:"innerPaneImg"}, msgBox);
                    imgBox.setAttribute('data-original',srcimage);
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
                                
                    var labelBox = domConstruct.create("span", {innerHTML: html}, msgBox);
                    gridshowcase.appendChild(pane.domNode);
                    pane.startup();
                }                    
            }catch(e){
                errorlog("SEARCH SHOWCASES",e);
            }
        } 
        
        $("#gridshowcase .innerPaneImg").lazyload({
            effect : "fadeIn",
            container: $("#gridshowcase"),
            failure_limit:999
        });
        
        stopLoading();
        if(callback){
            callback();
        }
    });      
};

opendetailshowcase = function(id) {
   actualshowcase = registry.byId(id).get("bean");  
   //Apro il dettaglio dell'offerta
   registry.byId("tabShowcase").performTransition("showcasedetail", 1, "slide");  
    registry.byId("headingback").set("moveTo","tabShowcase");
};


favouritesearchshowcase = function(favourite) {    
    var value = dom.byId('filterBoxShowcase').value;
    favouriteshowcase = favourite;
    if(favourite) {
    //Controllo lo stato dei preferiti
        domStyle.set('favouriteshowcasebuttonko', 'display','none');
        domStyle.set('favouriteshowcasebuttonok', 'display','inline');
        searchshowcase(value,false,true,1);    
    } else {
        domStyle.set('favouriteshowcasebuttonko', 'display','inline');
        domStyle.set('favouriteshowcasebuttonok', 'display','none');
        searchshowcase(value,false,false,1);
    }
};

searchshowcasefilter = function() {
    favouritesearchshowcase(favouriteshowcase);  
};

pagingShowcase = function(e){
   if(e.afterBottom && !loadnextpage) {
       loadnextpage = true;
       
       //Effettuo la chiamata alla pagina successica
       startLoading();
       
       //Calcolo il numero di pagina da visualizzare
      favouritesearchshowcase(favouriteshowcase);  
             
       var value = dom.byId('filterBoxShowcase').value;
       searchshowcase(value,true,favouriteshowcase,(actualpageshowcase+1), function(){
           loadnextpage = false;
           stopLoading();
       });      
   }
};

createshowcasedetail = function(){
    
    //Elimino la vecchia visualizzazione
    detailshowcase = registry.byId("showcasedetail");
    
    //Elimino il vecchio panello
    if( registry.byId("paneshowcasedetail")){
        registry.byId("paneshowcasedetail").destroyRecursive(false);
    }
    
    if(actualobject){
        showcase = actualobject; 
    }else if(actualshowcase){
        showcase = actualshowcase; 
    }else if(actualoffer){
        showcase = actualoffer; 
    }else if(actualevent){
        showcase = actualevent; 
    }
    
    //Creo il pannello
    pane = new Pane({id:"paneshowcasedetail"});
    msgdate = "";
    if(showcase.ragSoc){
        msgdate += showcase.ragSoc;
    }
      
    var msgBox = domConstruct.create("div", {class: "innerPaneDetail", innerHTML:msgdate}, pane.domNode);    
    detailshowcase.addChild(pane,0);  
        
    // Visualizzo la descrizione dell'offerta
    if( registry.byId("paneshowcasedetailhtml")){
        registry.byId("paneshowcasedetailhtml").destroyRecursive(false);
    } 
    //Creo il pannello
    panehtml = new Pane({id:"paneshowcasedetailhtml"});
    var msgBoxhtml = domConstruct.create("div", {class: "innerPaneDetail", innerHTML:showcase.description}, panehtml.domNode);   
    
    
    detailshowcase.addChild(panehtml);
    
    objectId = showcase.objectId;
    if(!objectId){
        objectId = showcase.merchantId;
    }
    
    //Recupero le immagini dell'offerta
    getShowcaseImages(request,objectId,function(images){         
        var imgs = new Array();
        for(i=0;i<images.length;i++) {
            var srcimage = images[i].fullPathName;
            var obj = new Object();
            obj.src = srcimage;  
            imgs.push(obj);                     
        }
        storeshowcaseimage.setData(imgs);
        registry.byId("carouselshowcaseimage").refresh();
    });
};


 opensearchsshowcase = function(){        
        var type = domStyle.get('filterBoxShowcaseDiv', 'display');
        if(type=='none'){
            domStyle.set('filterBoxShowcaseDiv', 'display', 'block');
        }else{
            domStyle.set('filterBoxShowcaseDiv', 'display', 'none');
            registry.byId('filterBoxShowcase').set('value',null);
        }
};


merchantPreferred = function(preferred){

    startLoading();
    setMerchantPreferred(request,actualmerchantid,preferred,function(){
        stopLoading();
        if(preferred){
           domStyle.set('favouriteshowcasedetailbuttonko', 'display', 'none');
           domStyle.set('favouriteshowcasedetailbuttonok', 'display', 'inline');
        }else{
           domStyle.set('favouriteshowcasedetailbuttonko', 'display', 'inline');
           domStyle.set('favouriteshowcasedetailbuttonok', 'display', 'none');
        }
    });
}



/*****************************************************************************************************************/
/*                                                QR-CODE
/*****************************************************************************************************************/

scanqrcode = function() {    
    //Apro il barcode scanner
    startLoading();
    cordova.plugins.barcodeScanner.scan(
      function (result) {          
          var urlqrcode = result.text;
          setMerchantPreferredByQrCode(request,urlqrcode,function(error) {
            stopLoading();
            if(!error){
                createMessage("Negozio inserito nei preferiti!", function(dlg){
                    dlg.hide();
                    dlg.destroyRecursive(false);
                });
            } else {
                createMessage("Errore inserimento nei preferiti!", function(dlg){
                    dlg.hide();
                    dlg.destroyRecursive(false);
                });
            }
            
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


        isLoading = function(){
            //var prog = ProgressIndicator.getInstance();
			
            //dom.byId("ViewApplication").appendChild(prog.domNode);
            //prog.start();
            alert(registry.byId('loading').get('display'));
            return false;
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
                //alert("ERROR:"+message+" - "+e.code);
            }else{
                //alert("ERROR:"+message+" - "+e);
            }
            stopLoading();
            loadnextpage = false;
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
                                            //domStyle.set('filterBoxOffer').domNode, 'display', 'inline');
                                            
                                            
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