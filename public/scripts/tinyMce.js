window.onload = function () {
  tinymce.init({
    selector: "#tiny-mce-post-body",
    plugins: [
      "advlist lists link  autolink autosave code",
      "preview",
      "searchreplace",
      "wordcount",
      "media table emoticons image imagetools",
    ],
    toolbar:
      "a11ycheck addcomment showcomments casechange checklist code formatpainter pageembed permanentpen table  || link image media",
    height: 300,
    automatic_uploads: true,
    images_upload_url: "/uploads/postimage",
    relative_urls: false,
    images_upload_handler: function (blobInfo, success, failure) {
      let headers = new Headers();
      headers.append("Accept", "Application/JSON");

      let formData = new FormData();
      formData.append("post-image", blobInfo.blob(), blobInfo.filename());

      let req = new Request("/uploads/postimage", {
        method: "POST",
        headers,
        mode: "cors",
        body: formData,
      });

      fetch(req)
        .then((res) => res.json())
        .then((data) => success(data.imgUrl))
        .catch(() => failure("HTTP Error"));
    },
  });
};
