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
   
function handleInput(data, titleText, isPostBack) {

 if(isPostBack){
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

  $.ajax({
    type: 'POST',
    url: '/webhook',
    data: {
      object:'web',
      data: data
    }
  }).done(function(msg) {
 
    this.$chatHistory = $('.chat-history');
    this.$chatHistoryList =  this.$chatHistory.find('ul');
    
     msg = JSON.parse(msg);
     // responses
    if(msg.type=='End'){
      var templateResponse = Handlebars.compile( $("#message-end-response-template").html());
      var contextResponse = { 
        finalText: msg.message,
       time: chat.getCurrentTime()
      };
      window.setTimeout(()=>{
        this.$chatHistoryList.append(templateResponse(contextResponse));
        chat.scrollToBottom();
      },1000)
      
    } else {
      var templateResponse = Handlebars.compile( $("#message-option-question-template").html());
      var contextResponse = { 
        questionText: msg.text,
       options : msg.options,
       time: chat.getCurrentTime()
      };
      window.setTimeout(()=>{
        this.$chatHistoryList.append(templateResponse(contextResponse));
        chat.scrollToBottom();
      },1000)
    }
   
  });

}

  