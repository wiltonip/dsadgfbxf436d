// source channel, target channel, width, height, radius
function boxesForGauss(sigma, n)  // standard deviation, number of boxes
{
    let wIdeal = Math.sqrt((12*sigma*sigma/n)+1);  // Ideal averaging filter width
    let wl = Math.floor(wIdeal);  if(wl%2==0) wl--;
    let wu = wl+2;

    let mIdeal = (12*sigma*sigma - n*wl*wl - 4*n*wl - 3*n)/(-4*wl - 4);
    let m = Math.round(mIdeal);
    // var sigmaActual = Math.sqrt( (m*wl*wl + (n-m)*wu*wu - n)/12 );

    let sizes = [];  for(let i=0; i<n; i++) sizes.push(i<m?wl:wu);
    return sizes;
}
function gaussBlur_4 (scl, tcl, w, h, r) {
    let bxs = boxesForGauss(r, 3);
    boxBlur_4 (scl, tcl, w, h, (bxs[0]-1)/2);
    boxBlur_4 (tcl, scl, w, h, (bxs[1]-1)/2);
    boxBlur_4 (scl, tcl, w, h, (bxs[2]-1)/2);
}
function boxBlur_4 (scl, tcl, w, h, r) {
    for(let i=0; i<scl.length; i++) tcl[i] = scl[i];
    boxBlurH_4(tcl, scl, w, h, r);
    boxBlurT_4(scl, tcl, w, h, r);
}
function gaussBlur_H (scl, tcl, w, h, r) {
    let bxs = boxesForGauss(r, 3);
    boxBlurH_4 (scl, tcl, w, h, (bxs[0]-1)/2);
    boxBlurH_4 (tcl, scl, w, h, (bxs[1]-1)/2);
    boxBlurH_4 (scl, tcl, w, h, (bxs[2]-1)/2);
}
function gaussBlur_V (scl, tcl, w, h, r) {
    let bxs = boxesForGauss(r, 3);
    boxBlurT_4 (scl, tcl, w, h, (bxs[0]-1)/2);
    boxBlurT_4 (tcl, scl, w, h, (bxs[1]-1)/2);
    boxBlurT_4 (scl, tcl, w, h, (bxs[2]-1)/2);
}
function gaussBlur_45 (scl, tcl, w, h, r) {
  let bxs = boxesForGauss(r, 3);
  boxBlur45 (scl, tcl, w, h, (bxs[0]-1)/2);
  boxBlur45 (tcl, scl, w, h, (bxs[1]-1)/2);
  boxBlur45 (scl, tcl, w, h, (bxs[2]-1)/2);
function boxBlur45 (scl, tcl, w, h, r) {
}
  let iarr = 1 / (r+r+1);
  for(let i=0; i<(w+h-1); i++) {
    let rl = Math.min(i,Math.min(w,h)-1,w+h-i-2);
    let ti = Math.min(i*w,(h-1)*w)+Math.max(0,i-h+1), li = ti, ri = ti+Math.min(rl,r)*(1-w);
    let fv = scl[ti], lv = scl[ti+rl*(1-w)], val = (r+1)*fv;
    for(let j=0 ; j<Math.min(rl,r); j++) { val += scl[ti+(j+1)*(1-w)];}
    if(rl<r){val += lv*(r-rl);};
    for(let j=0 ; j<=Math.min(rl-r,r); j++) { val += scl[ri] - fv       ;   tcl[ti] = Math.round(val*iarr);ri+=(1-w);ti+=(1-w);}
    for(let j=r+1; j<(rl+1-r); j++) { val += scl[ri] - scl[li];   tcl[ti] = Math.round(val*iarr);ri+=(1-w);li+=(1-w);ti+=(1-w);}
    for(let j=rl+1-r; j<rl+1; j++) { val += lv            - scl[li];   tcl[ti] = Math.round(val*iarr);li+=(1-w);ti+=(1-w);}
  }
}
function gaussBlur_135 (scl, tcl, w, h, r) {
  let bxs = boxesForGauss(r, 3);
  boxBlur135 (scl, tcl, w, h, (bxs[0]-1)/2);
  boxBlur135 (tcl, scl, w, h, (bxs[1]-1)/2);
  boxBlur135 (scl, tcl, w, h, (bxs[2]-1)/2);
}
function boxBlur135 (scl, tcl, w, h, r) {
  let iarr = 1 / (r+r+1);
  for(let i=0; i<(w+h-1); i++) {
    let rl = Math.min(i,Math.min(w,h)-1,w+h-i-2);
    let ti = Math.max(h-1-i,0)*w+Math.max(i-(h-1),0), li = ti, ri = ti+Math.min(rl,r)*(1+w);
    let fv = scl[ti], lv = scl[ti+rl*(1+w)], val = (r+1)*fv;
    for(let j=0 ; j<Math.min(rl,r); j++) {  val += scl[ti+(j+1)*(1+w)];}
    if(rl<r){val += lv*(r-rl);}
    for(let j=0 ; j<=Math.min(rl-r,r); j++) { val += scl[ri] - fv       ;   tcl[ti] = Math.round(val*iarr);ri+=(1+w);ti+=(1+w);}
    for(let j=r+1; j<(rl+1-r); j++) { val += scl[ri] - scl[li];   tcl[ti] = Math.round(val*iarr);ri+=(1+w);li+=(1+w);ti+=(1+w);}
    for(let j=rl+1-r; j<rl+1  ; j++) { val += lv            - scl[li];   tcl[ti] = Math.round(val*iarr);li+=(1+w);ti+=(1+w);}
  }
}
function boxBlurH_4 (scl, tcl, w, h, r) {
    let iarr = 1 / (r+r+1);
    for(let i=0; i<h; i++) {
        let ti = i*w, li = ti, ri = ti+r;
        let fv = scl[ti], lv = scl[ti+w-1], val = (r+1)*fv;
        for(let j=0; j<r; j++) val += scl[ti+j];
        for(let j=0  ; j<=r ; j++) { val += scl[ri] - fv       ;   tcl[ti] = Math.round(val*iarr); ri++;ti++;}
        for(let j=r+1; j<w-r; j++) { val += scl[ri] - scl[li];   tcl[ti] = Math.round(val*iarr); ri++;li++;ti++;}
        for(let j=w-r; j<w  ; j++) { val += lv        - scl[li];   tcl[ti] = Math.round(val*iarr); li++;tcl[ti++];}
    }
}
function boxBlurT_4 (scl, tcl, w, h, r) {
    let iarr = 1 / (r+r+1);
    for(let i=0; i<w; i++) {
        let ti = i, li = ti, ri = ti+r*w;
        let fv = scl[ti], lv = scl[ti+w*(h-1)], val = (r+1)*fv;
        for(let j=0; j<r; j++) val += scl[ti+j*w];
        for(let j=0  ; j<=r ; j++) { val += scl[ri] - fv     ;  tcl[ti] = Math.round(val*iarr);  ri+=w; ti+=w; }
        for(let j=r+1; j<h-r; j++) { val += scl[ri] - scl[li];  tcl[ti] = Math.round(val*iarr);  li+=w; ri+=w; ti+=w; }
        for(let j=h-r; j<h  ; j++) { val += lv      - scl[li];  tcl[ti] = Math.round(val*iarr);  li+=w; ti+=w; }
    }
}
onmessage = function(e){
  //console.log("msg received");
  let imageData = e.data[0];
  let imageWidth = e.data[1];
  let trial = e.data[2];
  let r = e.data[3];
  let pixCountMax =0;
  let imageHeight = imageData.length/imageWidth;
  let tempData = imageData.slice();
  let preBlurData = imageData.slice();
  let blurData = imageData.slice();
  gaussBlur_4(tempData,preBlurData,imageWidth,imageHeight,trial);
  tempData = preBlurData.slice();
  let maxDiff = 0;
  let avgDiff = 0;
  let pixCount = 0;
  gaussBlur_4(tempData,blurData,imageWidth,imageHeight,r);
  tempData = preBlurData.slice();
  for(let i = 0; i<tempData.length;i++){
    let avgVal = Math.max(blurData[i],1);
    let diff = preBlurData[i]/avgVal;
    maxDiff=Math.max(maxDiff,diff);
    avgDiff+=diff;
  }
  avgDiff/=tempData.length;
  for(let i = 0; i<tempData.length;i++){
    let avgVal = Math.max(blurData[i],1);
    let diff = Math.max(preBlurData[i],1)/avgVal;
    if(diff<avgDiff){
      tempData[i]=0;
    }else {
      tempData[i]=255;
    }
  }
  for(let i = imageWidth+1; i<tempData.length-imageWidth-1;i++){
    if(!tempData[i]
      && tempData[i] === tempData[i+1]
      && tempData[i] === tempData[i-1]
      && tempData[i] === tempData[i+imageWidth]
      && tempData[i] === tempData[i+imageWidth+1]
      && tempData[i] === tempData[i+imageWidth-1]
      && tempData[i] === tempData[i-imageWidth]
      && tempData[i] === tempData[i-imageWidth+1]
      && tempData[i] === tempData[i-imageWidth-1]){
      pixCount++;
    }
  }//console.log(trial + " :  " + pixCount)
  postMessage([pixCount,tempData]);
  close();
}
