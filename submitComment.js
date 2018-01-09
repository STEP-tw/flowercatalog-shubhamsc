const reqListener = function(){
  document.querySelector('#comments').innerHTML = this.responseText;
}

const getComments = function(){
  let req = new XMLHttpRequest();
  req.addEventListener('load',reqListener);
  req.open('GET','/submitComment');
  req.send();
};

//document.getElementById('submit').onclick = getComments;
exports.getComments = getComments;