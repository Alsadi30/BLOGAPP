window.onload = function(){
    console.log('hael')
    const likeBtn = document.getElementById('likeBtn')
    const dislikeBtn = document.getElementById('dislikeBtn')
  
    likeBtn.addEventListener('click',function(e){
        let postId = likeBtn.dataset.post
        reqlikeDislike('likes',postId)
          .then(res => res.json())
          .then(data => {
              let liketxt = data.liked ? 'Liked':'Like'
              liketxt = liketxt + `(${data.totalLikes})`
             let  disliketxt = 'Dislike' + `(${data.totalDislikes})`
  
             likeBtn.innerHTML = liketxt
             dislikeBtn.innerHTML = disliketxt
          })
          .catch(e=>{
              console.log(e)
            //   alert(e.response.data.error)
          })
  
    })

    
  
  
    dislikeBtn.addEventListener('click',function(e){
        let postId = dislikeBtn.dataset.post
        reqlikeDislike('dislikes',postId)
          .then(res => res.json())
          .then(data => {
              let disliketxt = data.disliked ? 'Disliked':'Dislike'
              disliketxt = disliketxt + `(${data.totalDislikes})`
             let  liketxt = 'Like' + `(${data.totalLikes})`
  
             likeBtn.innerHTML = liketxt
             dislikeBtn.innerHTML = disliketxt
          })
          .catch(e=>{
              console.log(e)
            //   alert(e.response.data.error)
          })
  
    })
    
    function reqlikeDislike (type,postId){
        let headers = new Headers()
        headers.append('Accept', 'Application/JSON')
        headers.append('Content-Type','Application/JSON')
  
        let req = new Request(`/api/${type}/${postId}`,{
            method:'GET',
            headers,
            mode:'cors'
        })
  
       return fetch(req) 
          
    }
  
  }
  