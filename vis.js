// Generated by IcedCoffeeScript 1.6.2d
(function() {
  var BubbleChart, CompareData, L, addState, charts, explanations, first_time, formatNumber, getExplanation, globalSelectedItem, handleNewState, iced, removeState, state, stories, __iced_k, __iced_k_noop, _ref, _ref1,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = {
    Deferrals: (function() {
      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) {
          return this.continuation(this.ret);
        }
      };

      _Class.prototype.defer = function(defer_params) {
        var _this = this;
        ++this.count;
        return function() {
          var inner_params, _ref;
          inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (defer_params != null) {
            if ((_ref = defer_params.assign_fn) != null) {
              _ref.apply(null, inner_params);
            }
          }
          return _this._fulfill();
        };
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    },
    trampoline: function(_fn) {
      return _fn();
    }
  };
  __iced_k = __iced_k_noop = function() {};

  L = function() {
    var x;
    x = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, x);
  };

  formatNumber = function(n, decimals) {
    var negativePrefix, negativeSuffix, num, prefix, remainder, s, suffix;
    suffix = "";
    negativePrefix = "";
    negativeSuffix = "";
    if (n < 0) {
      negativePrefix = " ????? ??";
      negativeSuffix = "";
      n = -n;
    }
    if (n >= 1000000000000) {
      suffix = " trillion";
      n = n / 1000000000000;
      decimals = 2;
    } else if (n >= 1000000000) {
      suffix = " ???????";
      n = n / 1000000000;
      decimals = 1;
    } else if (n >= 1000000) {
      suffix = " ??????";
      n = n / 1000000;
      decimals = 1;
    }
    prefix = "";
    if (decimals > 0) {
      if (n < 1) {
        prefix = "0";
      }
      s = String(Math.round(n * (Math.pow(10, decimals))));
      if (s < 10) {
        remainder = "0" + s.substr(s.length - decimals, decimals);
        num = "";
      } else {
        remainder = s.substr(s.length - decimals, decimals);
        num = s.substr(0, s.length - decimals);
      }
      return negativePrefix + prefix + num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + "." + remainder + suffix + negativeSuffix;
    } else {
      s = String(Math.round(n));
      s = s.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      return negativePrefix + s + suffix + negativeSuffix;
    }
  };

  CompareData = (function(_super) {
    __extends(CompareData, _super);

    function CompareData() {
      _ref = CompareData.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CompareData.prototype.defaults = {
      data: [],
      field: "",
      title: "?"
    };

    CompareData.prototype.initialize = function() {
      return this.on('change:field', function() {
        var data, field;
        field = this.get('field');
        data = budget_array_data[field];
        if (data) {
          console.log('setting field ' + field + " title: " + data.t);
          this.set('code', data.c);
          this.set('title', data.t);
          this.set('breadcrumbs', data.b);
          return this.set('data', data.d);
        } else {
          return console.log('field ' + field + ' is ' + data);
        }
      });
    };

    return CompareData;

  })(Backbone.Model);

  globalSelectedItem = null;

  BubbleChart = (function(_super) {
    __extends(BubbleChart, _super);

    function BubbleChart() {
      _ref1 = BubbleChart.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    BubbleChart.prototype.getFillColor = function(d) {
      var fillColor;
      fillColor = d3.scale.ordinal().domain([-3, -2, -1, 0, 1, 2, 3]).range(["#dbae00", "#eac865", "#f5dd9c", "#AAA", "#bfc3dc", "#9ea5c8", "#7b82c2"]);
      if (d.isNegative) {
        return "#fff";
      } else {
        return fillColor(d.changeCategory);
      }
    };

    BubbleChart.prototype.getStrokeColor = function(d) {
      var strokeColor;
      if (d.name === globalSelectedItem) {
        return "#FF0";
      }
      strokeColor = d3.scale.ordinal().domain([-3, -2, -1, 0, 1, 2, 3]).range(["#c09100", "#e7bd53", "#d9c292", "#999", "#a7aed3", "#7f8ab8", "#4f5fb0"]);
      return strokeColor(d.changeCategory);
    };

    BubbleChart.prototype.strokeWidth = function(d) {
      if (d.name === globalSelectedItem) {
        return 5;
      } else {
        return 1;
      }
    };

    BubbleChart.prototype.pctFormat = function(p) {
      var pFormat;
      pFormat = d3.format(".1%");
      if (p === Infinity || p === -Infinity) {
        return "N.A";
      } else {
        return pFormat(p);
      }
    };

    BubbleChart.prototype.defaultCharge = function(d) {
      if (d.value < 0) {
        return 0;
      } else {
        return -Math.pow(d.radius, 2.0) / 8;
      }
    };

    BubbleChart.prototype.totalSort = function(alpha) {
      var _this = this;
      return function(d) {
        var targetX, targetY;
        targetY = 0;
        targetX = 0;
        if (d.isNegative) {
          if (d.changeCategory > 0) {
            d.x = -200;
          } else {
            d.x = 1100;
          }
        }
        d.y = d.y + (targetY - d.y) * (_this.defaultGravity + 0.02) * alpha;
        return d.x = d.x + (targetX - d.x) * (_this.defaultGravity + 0.02) * alpha;
      };
    };

    BubbleChart.prototype.buoyancy = function(alpha) {
      var _this = this;
      return function(d) {
        var targetY;
        targetY = -(d.changeCategory / 3) * _this.boundingRadius;
        return d.y = d.y + (targetY - d.y) * _this.defaultGravity * alpha * alpha * alpha * 500;
      };
    };

    BubbleChart.prototype.categorizeChange = function(c) {
      if (isNaN(c)) {
        return 0;
      }
      if (c < -0.25) {
        return -3;
      }
      if (c < -0.05) {
        return -2;
      }
      if (c < -0.001) {
        return -1;
      }
      if (c <= 0.001) {
        return 0;
      }
      if (c <= 0.05) {
        return 1;
      }
      if (c <= 0.25) {
        return 2;
      }
      return 3;
    };

    BubbleChart.prototype.setOverlayed = function(overlayed) {
      overlayed = overlayed ? true : false;
      if (overlayed) {
        return this.transitiontime = 0;
      } else {
        return this.transitiontime = 1000;
      }
    };

    BubbleChart.prototype.initialize = function(options) {
      var _this = this;
      this.options = options;
      _.bindAll(this);
      this.width = 970;
      this.height = 550;
      this.id = this.options.id;
      this.overlayShown = false;
      console.log("BubbleChart:initialize", this.id);
      this.defaultGravity = 0.1;
      this.force = this.svg = this.circle = null;
      this.changeTickValues = [-0.25, -0.15, -0.05, 0.05, 0.15, 0.25];
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      this.model.bind('change:data', function() {
        return _this.updateData(_this.model.get('data'));
      });
      d3.select(this.el).html("");
      this.svg = d3.select(this.el).append("svg:svg");
      this.svg.on("click", function() {
        removeState();
        return false;
      });
      return console.log("init done", this.id);
    };

    BubbleChart.prototype.collectTitles = function(titles, field, prefix, state) {
      var code, data, n, name, _i, _len, _ref2, _results;
      if (prefix == null) {
        prefix = '';
      }
      if (state == null) {
        state = [];
      }
      if (!field) {
        return;
      }
      data = budget_array_data[field];
      if (data) {
        _ref2 = data.d;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          n = _ref2[_i];
          code = strings[n.id];
          name = strings[n.n];
          if (name && code) {
            titles.push({
              id: name,
              text: prefix + name,
              code: code,
              state: state
            });
          }
          _results.push(this.collectTitles(titles, n.d, prefix + name + ' | ', state.concat([n.d])));
        }
        return _results;
      }
    };

    BubbleChart.prototype.updateData = function(data) {
      var container, currentYearDataColumn, n, node, oldNodes, out, previousYearDataColumn, rScale, radiusScale, sid, sum, x, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref2;
      oldNodes = [];
      sum = 0;
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        x = data[_i];
        sum += x.b1;
      }
      this.totalValue = sum != null ? sum : 400000000;
      console.log("Totalvalue: " + this.totalValue);
      if (typeof this !== "undefined" && this !== null ? this.nodes : void 0) {
        _ref2 = this.nodes;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          node = _ref2[_j];
          oldNodes.push(node);
        }
      }
      this.nodes = [];
      this.titles = [];
      this.collectTitles(this.titles, this.model.get('field'));
      rScale = d3.scale.pow().exponent(0.5).domain([0, this.totalValue]).range([7, 165]);
      radiusScale = function(n) {
        return rScale(Math.abs(n));
      };
      this.boundingRadius = radiusScale(this.totalValue);
      currentYearDataColumn = 'b1';
      previousYearDataColumn = 'b0';
      for (_k = 0, _len2 = data.length; _k < _len2; _k++) {
        n = data[_k];
        out = null;
        sid = n.id;
        for (_l = 0, _len3 = oldNodes.length; _l < _len3; _l++) {
          node = oldNodes[_l];
          if (node.sid === sid) {
            out = node;
          }
        }
        if (out === null) {
          out = {
            x: -150 + Math.random() * 300,
            y: -150 + Math.random() * 300
          };
        }
        out.sid = n.id;
        out.code = strings[n.id];
        out.radius = radiusScale(n[currentYearDataColumn]);
        out.group = strings[n.p];
        out.groupvalue = n.pv;
        out.change = n.c / 100.0;
        out.changeCategory = this.categorizeChange(n.c / 100.0);
        out.value = n[currentYearDataColumn];
        out.name = strings[n.n];
        out.isNegative = n[currentYearDataColumn] < 0;
        out.positions = n.positions;
        out.drilldown = n.d;
        /*
        #  if (n.positions.total)
                	    	#     out.x = n.positions.total.x + (n.positions.total.x - (@width / 2)) * 0.5
                	    	#     out.y = n.positions.total.y + (n.positions.total.y - (150)) * 0.5
        */

        if ((n[currentYearDataColumn] > 0) && (n[previousYearDataColumn] < 0)) {
          out.changestr = "??? ?????? ??????";
          out.changeCategory = 3;
        }
        if ((n[currentYearDataColumn] < 0) && (n[previousYearDataColumn] > 0)) {
          out.changestr = "??? ?????? ??????";
          out.changeCategory = 3;
        }
        if (n.c === 99999) {
          out.changestr = "????? ????";
          out.changeCategory = 3;
        }
        this.nodes.push(out);
      }
      this.nodes.sort(function(a, b) {
        return Math.abs(b.value) - Math.abs(a.value);
      });
      this.titles.sort(function(a, b) {
        if (a.code > b.code) {
          return 1;
        } else {
          return -1;
        }
      });
      if (data.length > 0) {
        return this.render();
      } else {
        container = $("div[data-id='" + this.id + "']");
        if (this.transitiontime > 0) {
          this.circle.transition().duration(this.transitiontime).attr("r", function(d) {
            return 0;
          });
          return container.find(".overlay").css("opacity", 0.9).animate({
            opacity: 0
          }, this.transitiontime, function() {
            return container.remove();
          });
        } else {
          return container.remove();
        }
      }
    };

    BubbleChart.prototype.showOverlay = function(id) {
      var node, origin, scale, target, _i, _len, _node, _ref2;
      if (this.overlayShown) {
        return;
      }
      this.overlayShown = true;
      node = null;
      _ref2 = this.nodes;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        _node = _ref2[_i];
        if (_node.drilldown === id) {
          node = _node;
        }
      }
      if (node === null) {
        return;
      }
      scale = this.height / node.radius / 3;
      console.log("showOverlay: ", node.radius, this.height, scale);
      origin = "translate(" + this.centerX + "," + this.centerY + ")rotate(0)translate(1,1)scale(1)";
      target = "translate(" + this.centerX + "," + this.centerY + ")rotate(120)translate(" + (-node.x * scale) + "," + (-node.y * scale) + ")scale(" + scale + ")";
      if (this.transitiontime === 0) {
        this.svg.selectAll("circle").attr("transform", target);
      } else {
        this.svg.selectAll("circle").transition().duration(this.transitiontime).attrTween("transform", function() {
          return d3.interpolateString(origin, target);
        });
        console.log("TRANSITION " + origin + " -> " + target);
      }
      return $("#tooltip").hide();
    };

    BubbleChart.prototype.overlayRemoved = function() {
      var origin, target;
      this.setOverlayed(false);
      this.overlayShown = false;
      origin = this.svg.select("circle").attr("transform");
      target = "translate(" + this.centerX + "," + this.centerY + ")rotate(0)translate(1,1)scale(1)";
      this.svg.selectAll("circle").transition().duration(this.transitiontime).attrTween("transform", function() {
        return d3.interpolateString(origin, target);
      });
      return this.circle.attr("r", function(d) {
        return d.radius;
      });
    };

    BubbleChart.prototype.selectItem = function(item) {
      globalSelectedItem = item;
      this.circle.style("stroke-width", this.strokeWidth);
      return this.circle.style("stroke", this.getStrokeColor);
    };

    BubbleChart.prototype.render = function() {
      var container, dummy_url, frame, lasturlpart, likeref, likeurlparts, newlikeref, overlay, resizeFrame, search, setBreadcrumbs, tagClicked, tags, that, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      that = this;
      dummy_url = 'http://compare.open-budget.org.il/p/klxlq44.html';
      console.log('how many likes', $('.fblike').size());
      likeref = dummy_url;
      likeurlparts = likeref.split('/');
      likeurlparts.splice(-1);
      lasturlpart = location.href.split('/').splice(-1)[0];
      likeurlparts.push(lasturlpart + '.html');
      newlikeref = '//www.facebook.com/plugins/like.php?href=' + encodeURIComponent(likeurlparts.join('/')) + '&amp;send=false&amp;layout=button_count&amp;width=100&amp;show_faces=false&amp;font&amp;colorscheme=light&amp;action=like&amp;height=21&amp;appId=469139063167385';
      console.log('new like url', newlikeref);
      $('.fblike').attr('src', newlikeref);
      $("div[data-id='" + this.id + "'] .btnDownload").attr("href", "/images/large/" + (this.model.get('field')) + ".jpg");
      setBreadcrumbs = function(dd) {
        var bc, linkCode;
        if (dd == null) {
          dd = null;
        }
        bc = _this.model.get('breadcrumbs');
        if (!dd) {
          linkCode = "00";
          if (_this.model.get('code')) {
            bc += " (" + (_this.model.get('code')) + ")";
            linkCode += _this.model.get('code');
          }
        } else {
          bc += " | " + dd.name + (" (" + dd.code + ")");
          linkCode = dd.code;
        }
        $("div[data-id='" + _this.id + "'] .breadcrumbsLink").remove();
        $("div[data-id='" + _this.id + "'] .breadcrumbs").append('<a class="breadcrumbsLink" target="_new" href="http://budget.msh.gov.il/#' + linkCode + ',2013,0,1,1,1,0,0,0,0,0,0" class="active" target="top" data-toggle="tooltip" title="???? ??????? ????? ????? ??????">' + bc + '</a>');
        return $("div[data-id='" + _this.id + "'] .breadcrumbsLink").tooltip();
      };
      setBreadcrumbs();
      $("div[data-id='" + this.id + "'] .btnBack").tooltip();
      $("div[data-id='" + this.id + "'] .btnDownload").tooltip();
      $("div[data-id='" + this.id + "'] .color-index").tooltip();
      search = $("div[data-id='" + this.id + "'] .mysearch");
      $("div[data-id='" + this.id + "'] .mysearch-open").click(function() {
        search.select2("open");
        return false;
      });
      search.select2({
        placeholder: "???? ???? ??????",
        allowClear: true,
        data: this.titles
      });
      search.on("select2-open", function(e) {
        return $("div[data-id='" + that.id + "'] .breadcrumbs").css("visibility", "hidden");
      }).on("select2-close", function(e) {
        return $("div[data-id='" + that.id + "'] .breadcrumbs").css("visibility", "visible");
      }).on("select2-highlight", function(e) {
        return that.selectItem(e.choice.id);
      }).on("change", function(e) {
        var x, _i, _len, _ref2;
        console.log("changed:", e);
        if (e.added) {
          that.selectItem(e.added.id);
          _ref2 = e.added.state;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            x = _ref2[_i];
            addState(x);
          }
          return search.select2("val", "");
        } else {
          return that.selectItem(null);
        }
      });
      tags = $("div[data-id='" + this.id + "'] .tag");
      tagClicked = false;
      tags.mouseenter(function() {
        that.selectItem($(this).text());
        return tagClicked = false;
      }).mouseleave(function() {
        if (!tagClicked) {
          return that.selectItem(null);
        }
      }).click((function() {
        that.selectItem($(this).text());
        tagClicked = true;
        return false;
      }));
      container = $("div[data-id='" + this.id + "'] .overlayContainer");
      overlay = $("div[data-id='" + this.id + "'] .overlay");
      frame = $("div[data-id='" + this.id + "'] .frame");
      resizeFrame = function() {
        console.log("frame resize");
        _this.width = $(window).width() - 8;
        if (_this.width > 900) {
          _this.width = 900;
        }
        _this.centerX = _this.width / 2 + 4;
        _this.svg.attr("width", _this.width);
        _this.svg.style("width", _this.width + "px");
        if (!_this.overlayShown && _this.circle) {
          _this.circle.attr("transform", "translate(" + _this.centerX + "," + _this.centerY + ")rotate(0)translate(0,0)scale(1)");
        }
        return overlay.css("height", (frame.height() + 8) + "px");
      };
      $(window).resize(resizeFrame);
      resizeFrame();
      if (this.transitiontime > 0) {
        overlay.css("opacity", 0).animate({
          opacity: 0.9
        }, this.transitiontime);
      } else {
        overlay.css("opacity", 0.9);
      }
      this.circle = this.svg.selectAll("circle").data(this.nodes, function(d) {
        return d.sid;
      });
      that = this;
      this.circle.enter().append("svg:circle").attr("transform", "translate(" + this.centerX + "," + this.centerY + ")rotate(0)translate(0,0)scale(1)").attr("data-title", function(d) {
        return d.name;
      }).style("stroke-width", this.strokeWidth).style("fill", this.getFillColor).style("stroke", this.getStrokeColor).style("cursor", function(d) {
        if (budget_array_data[d.drilldown]) {
          return "pointer";
        } else {
          return "default";
        }
      }).on("click", function(d, i) {
        if (budget_array_data[d.drilldown]) {
          addState(d.drilldown);
        } else {
          setBreadcrumbs(d);
        }
        d3.event.stopPropagation();
        return false;
      }).on("mouseover", function(d, i) {
        var el, pctchngout, svgPos, tail, xpos, ypos;
        el = d3.select(this);
        svgPos = $(that.el).find("svg").offset();
        xpos = Number(el.attr('cx')) + that.centerX;
        tail = 100;
        if (xpos < 125) {
          tail += 125 - xpos;
          xpos = 125;
        }
        if (xpos > (that.width - 125)) {
          tail -= xpos - (that.width - 125);
          xpos = that.width - 125;
        }
        xpos += 4;
        ypos = Number(el.attr('cy'));
        if (ypos > 0) {
          ypos = ypos - d.radius - 10 + svgPos.top + that.centerY;
          $("#tooltipContainer").css("bottom", 0);
          d3.select("#tooltip .arrow.top").style("display", "none");
          d3.select("#tooltip .arrow.bottom").style("display", "block");
        } else {
          ypos = ypos + d.radius + 10 + svgPos.top + that.centerY;
          $("#tooltipContainer").css("bottom", "");
          d3.select("#tooltip .arrow.top").style("display", "block");
          d3.select("#tooltip .arrow.bottom").style("display", "none");
        }
        if (d.drilldown) {
          el.style("stroke", "#000").style("stroke-width", 3);
        }
        d3.select("#tooltip").style('top', ypos + "px").style('left', xpos + "px").style('display', 'block').classed('plus', d.changeCategory > 0).classed('minus', d.changeCategory < 0);
        d3.select("#tooltip .name").html(d.name);
        d3.select("#tooltip .department").text(d.group);
        d3.select("#tooltip .explanation").text(getExplanation(d.code, 2012));
        d3.select("#tooltip .value").html(formatNumber(d.value * 1000) + " \u20aa");
        d3.selectAll("#tooltip .arrow").style("right", tail + "px");
        if (d != null ? d.changestr : void 0) {
          pctchngout = d.changestr;
        } else {
          pctchngout = d.change === "N.A." ? "N.A" : that.pctFormat(Math.abs(d.change));
          pctchngout = pctchngout + (d.change < 0 ? "-" : "+");
        }
        return d3.select("#tooltip .change").html(pctchngout);
      }).on("mouseout", function(d, i) {
        d3.select(this).style("stroke-width", that.strokeWidth).style("stroke", function(d) {
          return that.getStrokeColor(d);
        });
        return d3.select("#tooltip").style('display', 'none');
      });
      if (this.transitiontime > 0) {
        this.circle.transition().duration(this.transitiontime).attr("r", function(d) {
          return d.radius;
        }).style("fill", function(d) {
          return _this.getFillColor(d);
        }).style("stroke", function(d) {
          return _this.getStrokeColor(d);
        });
        this.circle.exit().transition().duration(this.transitiontime).attr("r", function(d) {
          return 0;
        }).remove();
      } else {
        this.circle.attr("r", function(d) {
          return d.radius;
        }).style("fill", function(d) {
          return _this.getFillColor(d);
        }).style("stroke", function(d) {
          return _this.getStrokeColor(d);
        });
        this.circle.exit().remove();
      }
      if (this.force !== null) {
        this.force.stop();
      }
      this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]).gravity(-0.01).charge(this.defaultCharge).friction(0.9).on("tick", function(e) {
        var avgx, maxx, minx, num;
        maxx = 0;
        minx = 0;
        avgx = 0;
        num = _this.nodes.length;
        return _this.circle.each(_this.totalSort(e.alpha)).each(_this.buoyancy(e.alpha)).each(function(d) {
          var max, min;
          max = d.x + d.radius;
          maxx = max > maxx ? max : maxx;
          min = d.x - d.radius;
          minx = min < minx ? min : minx;
          return avgx = (maxx + minx) / 2;
        }).attr("cx", function(d) {
          return d.x - avgx;
        }).attr("cy", function(d) {
          return d.y;
        });
      }).start();
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "vis.coffee",
          funcname: "BubbleChart.render"
        });
        setTimeout((__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return __iced_deferrals.ret = arguments[0];
            };
          })(),
          lineno: 534
        })), 100);
        __iced_deferrals._fulfill();
      })(function() {
        var _ref2, _ref3;
        return (_ref2 = window.FB) != null ? (_ref3 = _ref2.XFBML) != null ? _ref3.parse() : void 0 : void 0;
      });
    };

    return BubbleChart;

  })(Backbone.View);

  state = {
    querys: [],
    selectedStory: null
  };

  charts = [];

  first_time = true;

  addState = function(toAdd) {
    state.querys.push(toAdd);
    return History.pushState(state, null, "?" + state.querys.join("/"));
  };

  removeState = function() {
    if (state.querys.length > 1) {
      state.querys.pop();
      return History.pushState(state, null, "?" + state.querys.join("/"));
    }
  };

  handleNewState = function() {
    var el, i, id, max, nextquery, overlaid, query, subtitle, template, title, _i, _j, _ref2, _ref3, _ref4, _ref5;
    state = History.getState();
    state = state.data;
    console.log("state changed: ", state);
    for (i = _i = 0, _ref2 = state.querys.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
      query = state.querys[i];
      nextquery = state.querys[i + 1];
      id = "id" + i;
      el = $("div[data-id='" + id + "'] .chart");
      if (el.size() === 0) {
        console.log("creating chart " + id);
        title = ((_ref3 = state.selectedStory) != null ? _ref3.title : void 0) || "????? ?? ??????";
        subtitle = ((_ref4 = state.selectedStory) != null ? _ref4.subtitle : void 0) || "";
        template = _.template($("#chart-template").html(), {
          id: id,
          title: title,
          subtitle: subtitle
        });
        $("#charts").append(template);
        el = $("div[data-id='" + id + "'] .chart");
        console.log("creating BubbleChart " + id);
        charts[i] = new BubbleChart({
          el: el,
          model: new CompareData,
          id: id
        });
      }
    }
    max = state.querys.length > charts.length ? state.querys.length : charts.length;
    console.log("max: " + max);
    for (i = _j = _ref5 = max - 1; _ref5 <= 0 ? _j <= 0 : _j >= 0; i = _ref5 <= 0 ? ++_j : --_j) {
      console.log("setting field for " + i);
      if (i >= state.querys.length) {
        console.log("removing chart #" + i);
        charts[i].updateData([]);
        charts.pop();
        continue;
      }
      query = state.querys[i];
      overlaid = false;
      if ((i < state.querys.length - 2) || (first_time && (i < state.querys.length - 1))) {
        overlaid = true;
      }
      charts[i].setOverlayed(overlaid);
      charts[i].model.set("field", query);
      if (i < state.querys.length - 1) {
        charts[i].showOverlay(state.querys[i + 1]);
      }
    }
    if (max > state.querys.length) {
      if (charts.length > 0) {
        console.log("chart " + (charts.length - 1) + ": overlay removed");
        charts[charts.length - 1].overlayRemoved();
      }
    }
    first_time = false;
    return $(".btnBack:first").css("display", "none");
  };

  explanations = {};

  getExplanation = function(code, year) {
    var explanation, years;
    years = explanations[code];
    console.log("got years ", years);
    if (years) {
      year = parseInt(year);
      explanation = years[year];
      if (!explanation) {
        explanation = years[Object.keys(years)[0]];
      }
      return explanation;
    }
    return null;
  };

  window.handleExplanations = function(data) {
    var code, curCodeExpl, entry, explanation, row, title, year, years, _i, _j, _len, _len1, _ref2, _year;
    row = 1;
    code = null;
    explanation = null;
    years = null;
    _ref2 = data.feed.entry;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      entry = _ref2[_i];
      title = entry.title.$t;
      if (title.search(/B[0-9]+/) === 0) {
        code = entry.content.$t;
      }
      if (title.search(/D[0-9]+/) === 0) {
        explanation = entry.content.$t;
      }
      if (title.search(/F[0-9]+/) === 0) {
        years = entry.content.$t;
        years = years.split(",");
        if (code !== null && explanation !== null) {
          for (_j = 0, _len1 = years.length; _j < _len1; _j++) {
            _year = years[_j];
            year = parseInt(_year);
            curCodeExpl = explanations[code];
            if (!curCodeExpl) {
              explanations[code] = {};
            }
            explanations[code][year] = explanation;
          }
        }
        code = explanation = null;
      }
    }
    return console.log(explanations);
  };

  stories = {};

  window.handleStories = function(data) {
    var chartid, code, entry, firstquery, query, range, ret_query, row, subtitle, title, up, _i, _len, _ref2, _ref3, _state;
    row = 1;
    code = null;
    title = null;
    subtitle = null;
    chartid = null;
    _ref2 = data.feed.entry;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      entry = _ref2[_i];
      range = entry.title.$t;
      if (range.search(/B[0-9]+/) === 0) {
        code = entry.content.$t;
      }
      if (range.search(/C[0-9]+/) === 0) {
        title = entry.content.$t;
      }
      if (range.search(/D[0-9]+/) === 0) {
        subtitle = entry.content.$t;
      }
      if (range.search(/G[0-9]+/) === 0) {
        chartid = entry.content.$t;
        stories[chartid] = {
          code: code,
          title: title,
          subtitle: subtitle
        };
        code = title = subtitle = chartid = null;
      }
    }
    console.log(stories);
    History.Adapter.bind(window, 'statechange', handleNewState);
    query = "klxlq126";
    ret_query = window.location.search.slice(1);
    if (ret_query.length === 0) {
      ret_query = window.location.hash;
      console.log("using hash: " + ret_query);
      if (ret_query.length > 0) {
        ret_query = query.split("?");
        if (ret_query.length > 1) {
          query = ret_query[1];
          console.log("got state (hash): " + query);
        }
      }
    } else {
      query = ret_query;
      console.log("got state (search): " + query);
    }
    if (stories[query]) {
      state.selectedStory = stories[query];
      query = state.selectedStory.code;
      console.log("Selected story (" + state.selectedStory.code + ")! " + state.selectedStory.title + ", " + state.selectedStory.subtitle);
    } else {
      state.selectedStory = null;
    }
    state.querys = query.split("/");
    console.log("Q", state.querys);
    if (state.querys.length === 1) {
      while (budget_array_data[state.querys[0]]) {
        up = budget_array_data[state.querys[0]].u;
        if (up) {
          state.querys.unshift(up);
        } else {
          break;
        }
      }
    }
    firstquery = state.querys[0];
    if (!state.selectedStory) {
      state.selectedStory = {
        'title': budget_array_data[firstquery].t,
        'subtitle': '?? ?????? ??????? ?????? ??? 400 ??????? ?????. ?????? ?? ????? ??? ???????? ???? ??? ??? ?????? ?????? ??? ????. ???? ?? ????? ????? ????? ????? ?????? ?????? ?? ?????? ??????? ???'
      };
    }
    _state = History.getState();
    console.log("getState: ", _state);
    if (((_ref3 = _state.data) != null ? _ref3.querys : void 0) && _state.data.querys.length > 0) {
      handleNewState();
    } else {
      console.log("xxx", _state.data);
      History.replaceState(state, null, "?" + state.querys.join("/"));
      console.log("pushed ", state);
    }
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        removeState();
      }
      return false;
    });
    $(".btnBack:last").live("click", function() {
      removeState();
      return false;
    });
    return $("body").append('<script type="text/javascript" src="http://spreadsheets.google.com/feeds/cells/0AqR1sqwm6uPwdDJ3MGlfU0tDYzR5a1h0MXBObWhmdnc/od6/public/basic?alt=json-in-script&callback=window.handleExplanations"></script>');
  };

  if ((document.createElementNS != null) && (document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect != null)) {
    $(function() {
      return $.get("http://spreadsheets.google.com/feeds/cells/0AurnydTPSIgUdEd1V0tINEVIRHQ3dGNSeUpfaHY3Q3c/od6/public/basic?alt=json-in-script", window.handleStories, "jsonp");
    });
  } else {
    $("#charts").hide();
  }

}).call(this);
