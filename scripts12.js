var myVar = setInterval(function() {
  myTimer();
}, 1000);

function myTimer() {
  var d = new Date();
  document.getElementById("clock").innerHTML = d.toLocaleTimeString();
}

var CDown = function() {
  this.state = 0;
  this.counts = [];
  this.interval = null; 
}

CDown.prototype = {
  init: function() {
    this.state = 1;
    var self = this;
    this.interval = window.setInterval(function() {
      self.tick();
    }, 1000);
  },
  add: function(date, id) {
    this.counts.push({
      d: date,
      id: id
    });
    this.tick();
    if (this.state == 0) this.init();
  },
  expire: function(idxs) {
    for (var x in idxs) {
      this.display(this.counts[idxs[x]], "Now!");
      this.counts.splice(idxs[x], 1);
    }
  },
  format: function(r) {
    var out = "";
    if (r.d != 0) {
      out += r.d + " " + ((r.d == 1) ? "day" : "days") + ", ";
    }
    if (r.h != 0) {
      out += r.h + " " + ((r.h == 1) ? "hour" : "hours") + ", ";
    }
    out += r.m + " " + ((r.m == 1) ? "min" : "mins") + ", ";
    out += r.s + " " + ((r.s == 1) ? "sec" : "secs") + ", ";

    return out.substr(0, out.length - 2);
  },
  math: function(work) {
    var y = w = d = h = m = s = ms = 0;

    ms = ("" + ((work % 1000) + 1000)).substr(1, 3);
    work = Math.floor(work / 1000);

    y = Math.floor(work / 31536000);
    w = Math.floor(work / 604800);
    d = Math.floor(work / 86400);
    work = work % 86400;

    h = Math.floor(work / 3600);
    work = work % 3600;

    m = Math.floor(work / 60);
    work = work % 60;

    s = Math.floor(work);

    return {
      y: y,
      w: w,
      d: d,
      h: h,
      m: m,
      s: s,
      ms: ms
    };
  },
  tick: function() {
    var now = (new Date()).getTime(),
      expired = [],
      cnt = 0,
      amount = 0;

    if (this.counts)
      for (var idx = 0, n = this.counts.length; idx < n; ++idx) {
        cnt = this.counts[idx];
        amount = cnt.d.getTime() - now;

        if (amount < 0) {
          expired.push(idx);
        }

        else {
          this.display(cnt, this.format(this.math(amount)));
        }
      }


    if (expired.length > 0) this.expire(expired);


    if (this.counts.length == 0) window.clearTimeout(this.interval);

  },
  display: function(cnt, msg) {
    document.getElementById(cnt.id).innerHTML = msg;
  }
};

window.onload = function() {
  var cdown = new CDown();

  cdown.add(new Date(3000, 10, 7, 7, 55, 27), "countbox1");
};
