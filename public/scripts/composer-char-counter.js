
$(document).ready(function() {
  $('#tweet-text').on('input', function() {
    console.log(140 - this.value);
    let counter = $(this).parents('section').find('output');
    counter.text(140 - this.value.length);
    if (Number(counter.text()) < 0) {
      counter.css('color', 'red');
    } else {
      counter.css('color', 'whitesmoke');
    }
  });
});