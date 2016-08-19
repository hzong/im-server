if (typeof jQuery == 'undefined') {
    alert("need jquery");
} if(typeof Strophe == 'undefined'){
    alert("need Strophe");
} else {

(function($) {
	if (typeof Easemob == 'undefined') {
	    Easemob = {};
	}
	if (typeof Easemob.im == 'undefined') {
	    Easemob.im = {};
	    Easemob.im.version="1.0.7";
	}
var emptyFn = function() {};

var createStandardXHR = function () {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {
        return false;
    }
};
var createActiveXHR = function () {
    try {
        return new window.ActiveXObject( "Microsoft.XMLHTTP" );
    } catch( e ) {
        return false;
    }
};
if (window.XDomainRequest) {
    XDomainRequest.prototype.oldsend = XDomainRequest.prototype.send;
    XDomainRequest.prototype.send = function() {
        XDomainRequest.prototype.oldsend.apply(this, arguments);
        this.readyState = 2;
    };
}

var xmlrequest = function (crossDomain){
    crossDomain = crossDomain || true;
    var temp = createStandardXHR () || createActiveXHR();

    if ("withCredentials" in temp) {
        return temp;
    }
    if(!crossDomain){
        return temp;
    }
    if(window.XDomainRequest===undefined){
        return temp;
    }
    var xhr = new XDomainRequest();
    xhr.readyState = 0;
    xhr.status = 100;
    xhr.onreadystatechange = emptyFn;
    xhr.onload = function () {
        xhr.readyState = 4;
        xhr.status = 200;
        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xhr.responseText);
        xhr.responseXML = xmlDoc;
        xhr.response = xhr.responseText;
        xhr.onreadystatechange();
    };
    xhr.ontimeout = xhr.onerror = function(){
        xhr.readyState = 4;
        xhr.status = 500;
        xhr.onreadystatechange();
    };
    return xhr;
};
Strophe.Request.prototype._newXHR = function(){
    var xhr =  xmlrequest(true);
  if (xhr.overrideMimeType) {
      xhr.overrideMimeType("text/xml");
  }
  xhr.onreadystatechange = this.func.bind(null, this);
  return xhr;
};
})(jQuery)
}
