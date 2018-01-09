const hideImage = function(){
  let image = document.getElementById('blinkImg');
  image.style.visibility= 'hidden';
  setTimeout(()=>{image.style.visibility= 'visible'},1000);
};