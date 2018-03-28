var country_code ='';

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
    var locale = $("#locale").val();
    if(locale == '' && country_code !='') {
       locale = localeCodes[country_code][0]+"_"+country_code;
    } 
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
    if(locale) {
        checkoutObj.locale = locale;
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
    $.getJSON('https://api.ipdata.co', function(data){
        country_code = data.country_code;
    });
    
    setTimeout(()=>{
        window.scrollTo(0,0);
        customizeCheckout();
    },300)
    
});


 const COUNTRY = {
    AD: 'AD',
    AE: 'AE',
    AG: 'AG',
    AI: 'AI',
    AL: 'AL',
    AM: 'AM',
    AN: 'AN',
    AO: 'AO',
    AR: 'AR',
    AT: 'AT',
    AU: 'AU',
    AW: 'AW',
    AZ: 'AZ',
    BA: 'BA',
    BB: 'BB',
    BE: 'BE',
    BF: 'BF',
    BG: 'BG',
    BH: 'BH',
    BI: 'BI',
    BJ: 'BJ',
    BM: 'BM',
    BN: 'BN',
    BO: 'BO',
    BR: 'BR',
    BS: 'BS',
    BT: 'BT',
    BW: 'BW',
    BY: 'BY',
    BZ: 'BZ',
    C2: 'C2',
    CA: 'CA',
    CD: 'CD',
    CG: 'CG',
    CH: 'CH',
    CI: 'CI',
    CK: 'CK',
    CL: 'CL',
    CM: 'CM',
    CN: 'CN',
    CO: 'CO',
    CR: 'CR',
    CV: 'CV',
    CY: 'CY',
    CZ: 'CZ',
    DE: 'DE',
    DJ: 'DJ',
    DK: 'DK',
    DM: 'DM',
    DO: 'DO',
    DZ: 'DZ',
    EC: 'EC',
    EE: 'EE',
    EG: 'EG',
    ER: 'ER',
    ES: 'ES',
    ET: 'ET',
    FI: 'FI',
    FJ: 'FJ',
    FK: 'FK',
    FM: 'FM',
    FO: 'FO',
    FR: 'FR',
    GA: 'GA',
    GB: 'GB',
    GD: 'GD',
    GE: 'GE',
    GF: 'GF',
    GI: 'GI',
    GL: 'GL',
    GM: 'GM',
    GN: 'GN',
    GP: 'GP',
    GR: 'GR',
    GT: 'GT',
    GW: 'GW',
    GY: 'GY',
    HK: 'HK',
    HN: 'HN',
    HR: 'HR',
    HU: 'HU',
    ID: 'ID',
    IE: 'IE',
    IL: 'IL',
    IN: 'IN',
    IS: 'IS',
    IT: 'IT',
    JM: 'JM',
    JO: 'JO',
    JP: 'JP',
    KE: 'KE',
    KG: 'KG',
    KH: 'KH',
    KI: 'KI',
    KM: 'KM',
    KN: 'KN',
    KR: 'KR',
    KW: 'KW',
    KY: 'KY',
    KZ: 'KZ',
    LA: 'LA',
    LC: 'LC',
    LI: 'LI',
    LK: 'LK',
    LS: 'LS',
    LT: 'LT',
    LU: 'LU',
    LV: 'LV',
    MA: 'MA',
    MC: 'MC',
    MD: 'MD',
    ME: 'ME',
    MG: 'MG',
    MH: 'MH',
    MK: 'MK',
    ML: 'ML',
    MN: 'MN',
    MQ: 'MQ',
    MR: 'MR',
    MS: 'MS',
    MT: 'MT',
    MU: 'MU',
    MV: 'MV',
    MW: 'MW',
    MX: 'MX',
    MY: 'MY',
    MZ: 'MZ',
    NA: 'NA',
    NC: 'NC',
    NE: 'NE',
    NF: 'NF',
    NG: 'NG',
    NI: 'NI',
    NL: 'NL',
    NO: 'NO',
    NP: 'NP',
    NR: 'NR',
    NU: 'NU',
    NZ: 'NZ',
    OM: 'OM',
    PA: 'PA',
    PE: 'PE',
    PF: 'PF',
    PG: 'PG',
    PH: 'PH',
    PL: 'PL',
    PM: 'PM',
    PN: 'PN',
    PT: 'PT',
    PW: 'PW',
    PY: 'PY',
    QA: 'QA',
    RE: 'RE',
    RO: 'RO',
    RS: 'RS',
    RU: 'RU',
    RW: 'RW',
    SA: 'SA',
    SB: 'SB',
    SC: 'SC',
    SE: 'SE',
    SG: 'SG',
    SH: 'SH',
    SI: 'SI',
    SJ: 'SJ',
    SK: 'SK',
    SL: 'SL',
    SM: 'SM',
    SN: 'SN',
    SO: 'SO',
    SR: 'SR',
    ST: 'ST',
    SV: 'SV',
    SZ: 'SZ',
    TC: 'TC',
    TD: 'TD',
    TG: 'TG',
    TH: 'TH',
    TJ: 'TJ',
    TM: 'TM',
    TN: 'TN',
    TO: 'TO',
    TR: 'TR',
    TT: 'TT',
    TV: 'TV',
    TW: 'TW',
    TZ: 'TZ',
    UA: 'UA',
    UG: 'UG',
    US: 'US',
    UY: 'UY',
    VA: 'VA',
    VC: 'VC',
    VE: 'VE',
    VG: 'VG',
    VN: 'VN',
    VU: 'VU',
    WF: 'WF',
    WS: 'WS',
    YE: 'YE',
    YT: 'YT',
    ZA: 'ZA',
    ZM: 'ZM',
    ZW: 'ZW'
};

const LANG = {
    AR: 'ar',
    CS: 'cs',
    DA: 'da',
    DE: 'de',
    EL: 'el',
    EN: 'en',
    ES: 'es',
    FI: 'fi',
    FR: 'fr',
    HE: 'he',
    HU: 'hu',
    ID: 'id',
    IT: 'it',
    JA: 'ja',
    KO: 'ko',
    NL: 'nl',
    NO: 'no',
    PL: 'pl',
    PT: 'pt',
    RU: 'ru',
    SK: 'sk',
    SV: 'sv',
    TH: 'th',
    TR: 'tr',
    ZH: 'zh'
};

var localeCodes = {
    [COUNTRY.AD]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.AE]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH, LANG.AR ],
    [COUNTRY.AG]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.AI]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.AL]: [ LANG.EN ],
    [COUNTRY.AM]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.AN]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.AO]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.AR]: [ LANG.ES, LANG.EN ],
    [COUNTRY.AT]: [ LANG.DE, LANG.EN ],
    [COUNTRY.AU]: [ LANG.EN ],
    [COUNTRY.AW]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.AZ]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.BA]: [ LANG.EN ],
    [COUNTRY.BB]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.BE]: [ LANG.EN, LANG.NL, LANG.FR ],
    [COUNTRY.BF]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.BG]: [ LANG.EN ],
    [COUNTRY.BH]: [ LANG.AR, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.BI]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.BJ]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.BM]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.BN]: [ LANG.EN ],
    [COUNTRY.BO]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.BR]: [ LANG.PT, LANG.EN ],
    [COUNTRY.BS]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.BT]: [ LANG.EN ],
    [COUNTRY.BW]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.BY]: [ LANG.EN ],
    [COUNTRY.BZ]: [ LANG.EN, LANG.ES, LANG.FR, LANG.ZH ],
    [COUNTRY.C2]: [ LANG.ZH, LANG.EN ],
    [COUNTRY.CA]: [ LANG.EN, LANG.FR ],
    [COUNTRY.CD]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.CG]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.CH]: [ LANG.DE, LANG.FR, LANG.EN ],
    [COUNTRY.CI]: [ LANG.FR, LANG.EN ],
    [COUNTRY.CK]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.CL]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.CM]: [ LANG.FR, LANG.EN ],
    [COUNTRY.CN]: [ LANG.ZH ],
    [COUNTRY.CO]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.CR]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.CV]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.CY]: [ LANG.EN ],
    [COUNTRY.CZ]: [ LANG.CS, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.DE]: [ LANG.DE, LANG.EN ],
    [COUNTRY.DJ]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.DK]: [ LANG.DA, LANG.EN ],
    [COUNTRY.DM]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.DO]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.DZ]: [ LANG.AR, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.EC]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.EE]: [ LANG.EN, LANG.RU, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.EG]: [ LANG.AR, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.ER]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.ES]: [ LANG.ES, LANG.EN ],
    [COUNTRY.ET]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.FI]: [ LANG.FI, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.FJ]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.FK]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.FM]: [ LANG.EN ],
    [COUNTRY.FO]: [ LANG.DA, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.FR]: [ LANG.FR, LANG.EN ],
    [COUNTRY.GA]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.GB]: [ LANG.EN ],
    [COUNTRY.GD]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.GE]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.GF]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.GI]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.GL]: [ LANG.DA, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.GM]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.GN]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.GP]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.GR]: [ LANG.EL, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.GT]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.GW]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.GY]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.HK]: [ LANG.EN, LANG.ZH ],
    [COUNTRY.HN]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.HR]: [ LANG.EN ],
    [COUNTRY.HU]: [ LANG.HU, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.ID]: [ LANG.ID, LANG.EN ],
    [COUNTRY.IE]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.IL]: [ LANG.HE, LANG.EN ],
    [COUNTRY.IN]: [ LANG.EN ],
    [COUNTRY.IS]: [ LANG.EN ],
    [COUNTRY.IT]: [ LANG.IT, LANG.EN ],
    [COUNTRY.JM]: [ LANG.EN, LANG.ES, LANG.FR, LANG.ZH ],
    [COUNTRY.JO]: [ LANG.AR, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.JP]: [ LANG.JA, LANG.EN ],
    [COUNTRY.KE]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.KG]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.KH]: [ LANG.EN ],
    [COUNTRY.KI]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.KM]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.KN]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.KR]: [ LANG.KO, LANG.EN ],
    [COUNTRY.KW]: [ LANG.AR, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.KY]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.KZ]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.LA]: [ LANG.EN ],
    [COUNTRY.LC]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.LI]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.LK]: [ LANG.EN ],
    [COUNTRY.LS]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.LT]: [ LANG.EN, LANG.RU, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.LU]: [ LANG.EN, LANG.DE, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.LV]: [ LANG.EN, LANG.RU, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.MA]: [ LANG.AR, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.MC]: [ LANG.FR, LANG.EN ],
    [COUNTRY.MD]: [ LANG.EN ],
    [COUNTRY.ME]: [ LANG.EN ],
    [COUNTRY.MG]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.MH]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.MK]: [ LANG.EN ],
    [COUNTRY.ML]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.MN]: [ LANG.EN ],
    [COUNTRY.MQ]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.MR]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.MS]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.MT]: [ LANG.EN ],
    [COUNTRY.MU]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.MV]: [ LANG.EN ],
    [COUNTRY.MW]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.MX]: [ LANG.ES, LANG.EN ],
    [COUNTRY.MY]: [ LANG.EN ],
    [COUNTRY.MZ]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.NA]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.NC]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.NE]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.NF]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.NG]: [ LANG.EN ],
    [COUNTRY.NI]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.NL]: [ LANG.NL, LANG.EN ],
    [COUNTRY.NO]: [ LANG.NO, LANG.EN ],
    [COUNTRY.NP]: [ LANG.EN ],
    [COUNTRY.NR]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.NU]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.NZ]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.OM]: [ LANG.AR, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.PA]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.PE]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.PF]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.PG]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.PH]: [ LANG.EN ],
    [COUNTRY.PL]: [ LANG.PL, LANG.EN ],
    [COUNTRY.PM]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.PN]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.PT]: [ LANG.PT, LANG.EN ],
    [COUNTRY.PW]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.PY]: [ LANG.ES, LANG.EN ],
    [COUNTRY.QA]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH, LANG.AR ],
    [COUNTRY.RE]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.RO]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.RS]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.RU]: [ LANG.RU, LANG.EN ],
    [COUNTRY.RW]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.SA]: [ LANG.AR, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.SB]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.SC]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.SE]: [ LANG.SV, LANG.EN ],
    [COUNTRY.SG]: [ LANG.EN ],
    [COUNTRY.SH]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.SI]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.SJ]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.SK]: [ LANG.SK, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.SL]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.SM]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.SN]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.SO]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.SR]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.ST]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.SV]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.SZ]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.TC]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.TD]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.TG]: [ LANG.FR, LANG.EN, LANG.ES, LANG.ZH ],
    [COUNTRY.TH]: [ LANG.TH, LANG.EN ],
    [COUNTRY.TJ]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.TM]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.TN]: [ LANG.AR, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.TO]: [ LANG.EN ],
    [COUNTRY.TR]: [ LANG.TR, LANG.EN ],
    [COUNTRY.TT]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.TV]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.TW]: [ LANG.ZH, LANG.EN ],
    [COUNTRY.TZ]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.UA]: [ LANG.EN, LANG.RU, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.UG]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.US]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.UY]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.VA]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.VC]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.VE]: [ LANG.ES, LANG.EN, LANG.FR, LANG.ZH ],
    [COUNTRY.VG]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.VN]: [ LANG.EN ],
    [COUNTRY.VU]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.WF]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.WS]: [ LANG.EN ],
    [COUNTRY.YE]: [ LANG.AR, LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.YT]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.ZA]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.ZM]: [ LANG.EN, LANG.FR, LANG.ES, LANG.ZH ],
    [COUNTRY.ZW]: [ LANG.EN ]
}
