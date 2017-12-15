$('.btn-toggle').click(function () {
    $(this).find('.btn').toggleClass('active');
    if ($(this).find('.btn-primary').length > 0) {
        $(this).find('.btn').toggleClass('btn-primary');
    }
    $(this).find('.btn').toggleClass('btn-default');
});

function layoutChange() {
    var layout = $("#layout").val();
    if (layout == "vertical") {
        $("#typeElem").hide()
        $("#brandingElem").hide();
        $("#fundingiconsElem").hide();
        $("#taglineElem").hide();
        $("#size option[value='small']").remove()
        $("#maxbuttons option:eq(3)").prop('selected',true)
    } else {
        $("#typeElem").show();
        $("#brandingElem").show();
        $("#fundingiconsElem").show();
        $("#taglineElem").show();
        $("#size").prepend($('<option value="small">Small</option>'));
        $("#maxbuttons option:eq(1)").prop('selected',true)
    }
    typeChange();
}

function typeChange() {
    var type = $("#type").val();
    if (type == 'credit' && $("#layout").val() == 'horizontal') {
        $("#color option").remove();
        $("#color").prepend($('<option value="darkblue">Dark Blue</option><option value="black">Black</option>'));
    } else {
        $("#color option").remove();
        $("#color").prepend($(
            '<option value="gold">Gold</option><option value="blue">Blue</option><option value="silver">Silver</option><option value="black">Black</option>'
        ));
    }
    // show branding only for buy now buttons
    if(type=='buynow' && $("#layout").val()!='vertical') {
        $("#brandingElem").show();
    } else {
        $("#brandingElem").hide();
    }
}

function customizeCheckout() {
    $("#paypal-button-container").empty();
    handleClick('customise',urlAppMapping[location.pathname]);
    $("#viewSC").show();

     checkoutObj = {
        env: $("#environment").val(),
        client: {
            sandbox: $("#clientId").val()
        },
        style: {
            layout: $("#layout").val(),
            label: $("#type").val(),
            size: $("#size").val(),
            shape: $("#shape").val(),
            color: $("#color").val(),
            fundingicons: JSON.parse($("[name=fundingicons]:checked").val()),
            tagline: JSON.parse($("[name=tagline]:checked").val()),
            branding: JSON.parse($("[name=branding]:checked").val()),
            maxbuttons: parseInt($("#maxbuttons").val())
        }
    }
    if (checkoutObj.style.branding == false) {
        delete checkoutObj.style.branding;
    }
    if(checkoutObj.style.label!='buynow'){
        delete checkoutObj.style.branding;
        $("#brandingElem").hide();
    }

    if (checkoutObj.style.label == 'credit' || checkoutObj.style.layout=='vertical') {
        delete checkoutObj.style.fundingicons;
        $("#fundingiconsElem").hide();
    } else {
        $("#fundingiconsElem").show();
    }

    if (checkoutObj.style.layout == "vertical") {
        delete checkoutObj.style.label;
        delete checkoutObj.style.branding;
        delete checkoutObj.style.fundingicons;
        delete checkoutObj.style.tagline;
    }
    
    createCheckoutExp(checkoutObj);

    return false;
}

$(document).ready(function () {
    customizeCheckout();
    setTimeout(()=>{
        window.scrollTo(0,0);
    },100)
    
});