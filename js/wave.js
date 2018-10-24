var wave = document.querySelector('.waveemoji');

wave.addEventListener('click', function() {
	var $this = this;

  $this.classList.add('js-wave');

  setTimeout(function() {
  	$this.classList.remove('js-wave');
  }, 1000);
})

{/* <img class="waveemoji" tabindex="1" draggable="false" src="https://mishascholte.nl/portfolio/wp-content/uploads/2018/08/wave.svg" alt="??" /> */}