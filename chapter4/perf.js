function CScor(el, tiers, parentScore) {
    let score = 0;
    const tagName = el.tagName;
    if ("SCRIPT" !== tagName && "STYLE" !== tagName && "META" !== tagName && "HEAD" !== tagName) {
      const childrenLen = el.children ? el.children.length : 0;
      if (childrenLen > 0) for (let childs = el.children, len = childrenLen - 1; len >= 0; len--) {
        score += calculateScore(childs[len], tiers + 1, score > 0);
      }
      if (score <= 0 && !parentScore) {
        if (!(el.getBoundingClientRect && el.getBoundingClientRect().top < WH)) return 0;
      }
      score += 1 + .5 * tiers;
    }
    return score;
  }
  calFinallScore() {
    try {
      if (this.sendMark) return;
      const time = Date.now() - performance.timing.fetchStart;
      var isCheckFmp = time > 30000 || SCORE_ITEMS && SCORE_ITEMS.length > 4 && time - (SCORE_ITEMS && SCORE_ITEMS.length && SCORE_ITEMS[SCORE_ITEMS.length - 1].t || 0) > 2 * CHECK_INTERVAL || (SCORE_ITEMS.length > 10 && window.performance.timing.loadEventEnd !== 0 && SCORE_ITEMS[SCORE_ITEMS.length - 1].score === SCORE_ITEMS[SCORE_ITEMS.length - 9].score);
      if (this.observer && isCheckFmp) {
        this.observer.disconnect();
        window.SCORE_ITEMS_CHART = JSON.parse(JSON.stringify(SCORE_ITEMS));
        let fmps = getFmp(SCORE_ITEMS);
        let record = null
        for (let o = 1; o < fmps.length; o++) {
          if (fmps[o].t >= fmps[o - 1].t) {
            let l = fmps[o].score - fmps[o - 1].score;
            (!record || record.rate <= l) && (record = {
              t: fmps[o].t,
              rate: l
            });
          }
        }
        //  
        this.fmp = record && record.t || 30001;
        try {
          this.checkImgs(document.body)
          let max = Math.max(...this.imgs.map(element => {
            if(/^(\/\/)/.test(element)) element = 'https:' + element;
            try {
              return performance.getEntriesByName(element)[0].responseEnd || 0
            } catch (error) {
              return 0
            }
          }))
          record && record.t > 0 && record.t < 36e5 ? this.setPerformance({
            fmpImg: parseInt(Math.max(record.t , max))
          }) : this.setPerformance({});
        } catch (error) {
          this.setPerformance({});
          // console.error(error)
        }
      } else {
        setTimeout(() => {
          this.calFinallScore();
        }, CHECK_INTERVAL);
      }
    } catch (error) {
      
    }
  }