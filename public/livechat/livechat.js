    var chat = {
      messageToSend: '',
      init: function() {
        this.cacheDOM();
        this.bindEvents();
        this.render();
      },
      cacheDOM: function() {
        this.$chatHistory = $('.chat-history');
        this.$button = $('button');
        this.$textarea = $('#message-to-send');
        this.$chatHistoryList =  this.$chatHistory.find('ul');
      },
      bindEvents: function() {
        this.$button.on('click', this.addMessage.bind(this));
        this.$textarea.on('keyup', this.addMessageEnter.bind(this));
      },
      render: function() {
        this.scrollToBottom();
        if (this.messageToSend.trim() !== '') {
          var template = Handlebars.compile( $("#message-template").html());
          var context = { 
            messageOutput: this.messageToSend,
            time: this.getCurrentTime()
          };
  
          this.$chatHistoryList.append(template(context));
          this.scrollToBottom();
          this.$textarea.val('');
          
          handleInput(this.messageToSend);
         
        }
        
      },
      
      addMessage: function() {
        this.messageToSend = this.$textarea.val()
        this.render();         
      },
      addMessageEnter: function(event) {
          // enter was pressed
          if (event.keyCode === 13) {
            this.addMessage();
          }
      },
      scrollToBottom: function() {
         this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
      },
      getCurrentTime: function() {
        return new Date().toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      }
      
    };
    
    chat.init();
    
    var searchFilter = {
      options: { valueNames: ['name'] },
      init: function() {
        var userList = new List('people-list', this.options);
        var noItems = $('<li id="no-items-found">No items found</li>');
        
        userList.on('updated', function(list) {
          if (list.matchingItems.length === 0) {
            $(list.list).append(noItems);
          } else {
            noItems.detach();
          }
        });
      }
    };
    
    searchFilter.init();
    
    function handlePostBack(payload , titleText) {
      
      handleInput(payload, titleText, true);
    
    } 
   
function handleInput(datum, titleText, isPostBack) {
var type="";
 if(isPostBack){
   type="payload";
  var templateResponse = Handlebars.compile( $("#message-option-response-template").html());
  var contextResponse = { 
   selectedOption : titleText,
   time: chat.getCurrentTime()
  };
  this.$chatHistory = $('.chat-history');
  this.$chatHistoryList =  this.$chatHistory.find('ul');
  this.$chatHistoryList.append(templateResponse(contextResponse));
  chat.scrollToBottom();
 }

 this.$chatHistory = $('.chat-history');
 this.$chatHistoryList =  this.$chatHistory.find('ul');
 

var html = `
<li class="typings">
<div class="message-data" style='float:left'>
<div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
</div> <br/>
<div class="message-data-name" style='float:left;margin-top:10%'> I BOT</div>

</div>
</li>`

 this.$chatHistoryList.append(html);
 chat.scrollToBottom();
 $.getJSON("https://jsonip.appspot.com?callback=?",
 function(ipdata){
    alert( "Your ip: " + ipdata.ip);
 $.ajax({
    type: 'POST',
    url: 'https://livechat-help.herokuapp.com/webhook',
    data :{
      sender :ipdata.ip,
      data : datum,
      type : type,
      object: 'web'
    }
  }).done(function(msg) {
    
    window.setTimeout(()=>{
      $(".typings").hide();
      
    },500);

    this.$chatHistory = $('.chat-history');
    this.$chatHistoryList =  this.$chatHistory.find('ul');
    // msg = JSON.parse(msg);
     console.log("msg",msg);
     // responses
    if(msg.type=='text'){
      var templateResponse = Handlebars.compile( $("#message-end-response-template").html());
      var contextResponse = { 
        finalText: msg.message,
       time: chat.getCurrentTime()
      };
      window.setTimeout(()=>{
        this.$chatHistoryList.append(templateResponse(contextResponse));
        chat.scrollToBottom();
      },1100)
      
    } else {

      if(msg.message) {

        let templateResponse = Handlebars.compile( $("#message-end-response-template").html());
        let contextResponse = { 
          finalText: msg.message,
         time: chat.getCurrentTime()
        };
        
        window.setTimeout(()=>{
          this.$chatHistoryList.append(templateResponse(contextResponse));
          chat.scrollToBottom();
        },1100)
      }

      let templateResponse = Handlebars.compile( $("#message-option-question-template").html());

      for(var i =0 ;i< msg.options.length;i++){
        let className = "primary";
        switch(i) {
          case 0: className='primary'; break;
          case 1: className='danger'; break;
          case 2: className='warning'; break;
          case 3: className='success'; break;
          case 4: className = "info"; break;
        }
        msg.options[i].className = className;
      }

      let contextResponse = { 
        questionText: msg.optionTitle,
       options : msg.options,
       time: chat.getCurrentTime(),
       initialText : msg.message
      };
      
      window.setTimeout(()=>{
        this.$chatHistoryList.append(templateResponse(contextResponse));
        chat.scrollToBottom();
      },1100)
    }
   
  });
});
}

  