window.onscroll = function() {
    myFunction();
  };

  function myFunction() {
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      document.getElementById("navigation").className = "header headerScrolled";
    } else {
      document.getElementById("navigation").className = "header";
    }
  }