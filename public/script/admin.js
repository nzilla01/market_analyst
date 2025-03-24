// tinymce.init({
//     selector: '#content',
//     api_key: 'zxv2zukjmlofpavnm7ijigvkyu31x0n8b8bkk76itvzyrwtd',
//     height: 400,  
//     plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak emoticons preview',
//     toolbar: 'undo redo | formatselect | bold italic backcolor forecolor|styles |preview| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image | code emoticons'
// })

let quill = new Quill('#container',{
    theme: 'snow', // 'bubble' theme is also available
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // Basic formatting
        ['blockquote', 'code-block'], // Quote & code
        [{ 'header': 1 }, { 'header': 2 }], // Header styles
        [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
        [{ 'script': 'sub' }, { 'script': 'super' }], // Sub/super script
        [{ 'indent': '-1' }, { 'indent': '+1' }], // Indent
        [{ 'direction': 'rtl' }], // Text direction
        [{ 'size': ['small', false, 'large', 'huge'] }], // Font sizes
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Headers
        [{ 'color': [] }, { 'background': [] }], // Text color & background
        [{ 'font': [] }], // Fonts
        [{ 'align': [] }], // Alignment
        ['clean'], // Remove formatting
        ['link', 'image', 'video'] // Media options
      ]
    }
  });