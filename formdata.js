/**
 * Emulate FormData for some browsers
 * MIT License
 * (c) 2010 François de Metz
 * @contributor gabe@fijiwebdesign.com 
 */
(function(w) {
  if (w.FormData)
      return;
  function FormData() {
      this.fake = true;
      this.boundary = "--------FormData" + Math.random();
      this._fields = [];
  }
  FormData.prototype.has = function(key) {
      return this._fields.filter(function(entry) {
          return entry[0] === key
      }).length > 0 ? true : false
  }
  FormData.prototype.delete = function(key) {
      this._fields = this._fields.filter(function(entry) {
          return entry[0] !== key
      })
  }
  FormData.prototype.set = function(key, value) {
      if (this.has(key)) {
        this._set(key, value)
      } else {
        this.append(key, value)
      }	
  }
  FormData.prototype._set = function(key, value) {
    this._fields = this._fields.map(function(entry, i) {
        if (entry[0] === key) {
          return [key, value]
        }
        return entry
    })
  }
  FormData.prototype.append = function(key, value) {
      this._fields.push([key, value]);
  }
  FormData.prototype.toString = function() {
      var boundary = this.boundary;
      var body = "";
      this._fields.forEach(function(field) {
          body += "--" + boundary + "\r\n";
          // file upload
          if (field[1].name) {
              var file = field[1];
              body += "Content-Disposition: form-data; name=\""+ field[0] +"\"; filename=\""+ file.name +"\"\r\n";
              body += "Content-Type: "+ file.type +"\r\n\r\n";
              body += file.getAsBinary() + "\r\n";
          } else {
              body += "Content-Disposition: form-data; name=\""+ field[0] +"\";\r\n\r\n";
              body += field[1] + "\r\n";
          }
      });
      body += "--" + boundary +"--";
      return body;
  }
  w.FormData = FormData;
})(window);
