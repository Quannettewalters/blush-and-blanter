
function getMessage(m) {
  const e = document.createElement("div");
  e.setAttribute("class", "message");
  e.dataset.post_id = m._id;
  e.innerHTML = `
    <hr>
    FROM:  ${m.username}<br>\n    
    WHEN:  ${m.createdAt}<br>\n    
    TEXT:  ${m.text}<br>\n
    LIKES: ${m.likes.length}
  `;
  const b = document.createElement("button");
  b.addEventListener("click", async ()=>{
    //is username in list of likes?
    const like = m.likes.find(like=>like.username===localStorage.username);
    if( like != undefined){
      //found - delete
      await deleteLike(like._id);
      window.location.href = 'messages.html'; //refresh page
    }else{
      //not found - create
      await sendLike(m._id);
      window.location.href = 'messages.html'; //refresh page
    }
  });//end click
  
  const like = m.likes.find(like=>like.username===localStorage.username);
  b.innerText = like != undefined ? "UnLike" : "Like";
  e.appendChild(b);
  return e;
}
document.addEventListener("DOMContentLoaded", async () => {
  const messages = await getMessageList();
  //output.innerHTML = messages.map(getMessage).join("<hr>\n")
  messages.forEach(m => output.appendChild(getMessage(m)));
});//end load