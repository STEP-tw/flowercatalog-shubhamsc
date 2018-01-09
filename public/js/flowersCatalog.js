const hideImage = function(){
  let image = document.getElementById('blinkImg');
  image.style.visibility= 'hidden';
  setTimeout(()=>{image.style.visibility= 'visible'},1000);
};

let getComments = function(){
  return data.map(function(comment){
    return `<br>${comment.date} At ${comment.time}<br><strong>${comment.name}</strong><br>${comment.comment}`;
  }).join('<br>------------------------------<br>');
};

let showComments = function(){
  document.getElementById('comments').innerHTML = getComments();
};

window.onload = showComments;