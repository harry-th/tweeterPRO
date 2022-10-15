/* eslint-disable no-undef */
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// let Tweet =  require('../../server/model/tweet');
const escapee = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

let createTweetElement = function(tweetObj) {
  const tweet = $(`<article>
<header>
    <div><img src=${escapee(tweetObj.avatar)}/> ${escapee(tweetObj.name)}</div>
    <p>
    ${escapee(tweetObj.text)}
    </p>
</header>
<hr />
<footer>
    <time>${escapee(timeago.format(tweetObj.created_at))}</time>
    <span>
        <i class="fa-solid fa-flag"></i>
        <i class="fa-regular fa-retweet"></i>
        <i class="fa-solid fa-heart" value=${tweetObj.likes}></i>
    </span>
</footer>
</article>`);
  return tweet;
};
let renderTweets = function(allTweets) {
  for (let tweet of allTweets) {
    let renTweet = createTweetElement(tweet);
    $('.tweet-container').prepend(renTweet);
   
  }
};
let scrollButton = () => {
  if ($(window).scrollTop() > 500) {
    $('#upButton').show();
  } else {
    $('#upButton').hide();
  }
};
let twooot = {};
let  pollServer = () => {
  // let oldData = {};
  setTimeout(function() {
    $.get('/tweets', (data)=>{
      if (JSON.stringify(data) !== twooot) {
        
        renderTweets(data);
        $('.tweet-container').fadeOut(0);
        $('article:first-child').css('top', '-105px').css('opacity', '0').animate({
          top:'+=10px',
          opacity: '+=1'
        }, 400, 'linear');
        $('article').css('top', '-95px').animate({
          top:'+=95px',
        }, 800, 'linear');
        $('.tweet-container').fadeIn('slow');
        twooot = JSON.stringify(data);
        pollServer();
        // oldData = data;
      }
      pollServer();
    });
  }, 2000);
};

$(document).ready(function() {
  $('#upButton').hide();
  $('#upButton').on('click', ()=> $(window).scrollTop(0,0));
  $(window).on('scroll',scrollButton);
  $('#tweetForm').on('submit', function(e) {
    let info = $(this).serialize();
    $.post('/tweets', info).then(()=>{
      $.get('/tweets', (data) => {
        $('.tweet-container').empty();
        renderTweets(data);
        twooot = JSON.stringify(data);
      }).then(() => {
        $('article:first-child').css('top', '-205px').css('opacity', '0').animate({
          top:'+=10px',
          opacity: '+=1'
        }, 400, 'linear');
        $('article').css('top', '-195px').animate({
          top:'+=195px',
        }, 800, 'linear');
      });
    });
    e.preventDefault();
  });
  pollServer();
  $('.new-tweet').hide();
  $('#dropTweet').on('click',()=>{
    $('.new-tweet').slideToggle('slow');
  });
});
