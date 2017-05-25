/* globals saveAs */

$(function() {
  var canvas = document.getElementById("doItForHer");
  var ctx = canvas.getContext("2d");
  
  
  var templateUrl = "https://cdn.glitch.com/1a9eb893-d739-4e1f-b4fd-ab48451806f2%2Fcdf.jpg?1495676983581"
  
  // awful hacks to bypass cross-origin weirdness
  
  var templateImg = new Image();
  templateImg.src = templateUrl + '?' + new Date().getTime();
  templateImg.setAttribute('crossOrigin', '');  
  
  templateImg.onload = function() {
    ctx.drawImage(templateImg, 0, 0, 936, 411);
  }
  
  
  // 1280 × 563
  
//   width: 105
  // height: 105?
  
  var $imageList = $('#sortable');
  
  $('#upload').change(function(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      var reader = new FileReader();
      reader.onload = function(event) {
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = function() {
//           probably need to constrain the image somehow?
          // but also not mess it up for drawing it?
          // link thumbnail to a cached version?
          
          $imageList.html(img)
          
          draw();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(e.target.files[i]);
    }
  });
  
  $('.texty').on('keyup change', function (e) {
    // console.log('texty?')
    draw()
    
  })
  
  $('.download').click(function () {
    canvas.toBlob(function(blob) {
      saveAs(blob, "ONE_FEAR.png");
    });
  });

  $("ul, li").disableSelection(); // lol what was this even
  
  function draw () {
    ctx.drawImage(templateImg, 0, 0, 936, 411);
    document.querySelectorAll('.toolbar img').forEach(function(element, i) {
      ctx.drawImage(element, 380, 150, 175, 175);
    });
    
      var text = $('.texty').val();
      console.log(text)
      if (text) {
        ctx.font="20px Helvetica";
        var lines = getLines(ctx, text, 170)
        console.log(lines)
        var verticalSpacer = 25;
        // 8 is the most!
        
        var startingPoint = 250;
        if (lines.length <= 4) {
          startingPoint = startingPoint - (lines.length * verticalSpacer)
        } else {
          startingPoint = 150
        }
        
        lines.forEach(function (line, i) {
          ctx.fillText(line,380, startingPoint + (25 * i));
        })
      }
  }
  
  
  
  // copied from https://stackoverflow.com/a/16599668
  function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}
});
