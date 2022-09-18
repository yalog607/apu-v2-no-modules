/**
 * Main
 */

 function copyToken() {
  /* Get the text field */
  var copyText = document.getElementById("api_token");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);
}

function copyNoidung() {
  /* Get the text field */
  var copyText = document.getElementById("noidung");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);
}

function copyCuphap() {
  /* Get the text field */
  var copyText = document.getElementById("cuphap");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);
}

function copyStk() {
  /* Get the text field */
  var copyText = document.getElementById("stk");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);
}

function sweetCopy() {
  Swal.fire({
      title: 'Thông báo',
      text: 'Sao chép thành công',
      confirmButtonColor: '#007bff',
      icon: 'success',
      confirmButtonText: 'Tôi đã hiểu',
      timer: 1500
  })
}

function sweetAdd() {
  Swal.fire({
      title: 'Thêm thành công',
      confirmButtonColor: '#007bff',
      icon: 'success',
      confirmButtonText: 'Tôi đã hiểu',
      timer: 1500
  })
}

function sweetSave() {
  Swal.fire({
      title: 'Thông báo',
      confirmButtonColor: '#007bff',
      text: 'Lưu thành công',
      icon: 'success',
      confirmButtonText: 'Tôi đã hiểu',
      timer: 1500
  })
}

function sweetBank() {
  Swal.fire({
      title: 'Thông báo',
      confirmButtonColor: '#007bff',
      text: 'Vui lòng chuyển khoản đúng nội dung, không dùng momo chuyển tiền sang bank, không dùng mbbank chuyển sang vietcombank!',
      confirmButtonText: 'Tôi đã hiểu',
  })
}

function sweetUpdate() {
  Swal.fire({
      title: 'Cập nhật thành công',
      confirmButtonColor: '#007bff',
      icon: 'success',
      confirmButtonText: 'Tôi đã hiểu',
      timer: 1000
  })
}

function sweetDelete() {
  Swal.fire({
      title: 'Xóa thành công',
      confirmButtonColor: '#007bff',
      icon: 'success',
      confirmButtonText: 'Tôi đã hiểu',
      timer: 1100
  })
}

function sweetErrorWhenAddBank() {
  Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Tài khoản đã có trong database!',
      confirmButtonColor: '#007bff',
      showConfirmButton: false
  })
}

function sweetOrder() {
  Swal.fire({
      title: 'Xác nhận thanh toán!',
      confirmButtonColor: '#007bff',
      text: "Bạn có muốn thanh toán đơn hàng? Chúng tôi sẽ không hoàn tiền với đơn đã thanh toán.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7066e0',
      confirmButtonText: 'Tôi đồng ý',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Đóng',
    }).then((result) => {
      if (result.isConfirmed) {
          Swal.fire({
              title: 'Thông báo',
              confirmButtonColor: '#007bff',
              text: 'Thanh toán đơn hàng thành công',
              icon: 'success',
              confirmButtonText: 'Tôi đã hiểu'
          })
      }
    })
}

function sweetOrdered() {
  Swal.fire({
      title: 'Thông báo',
      confirmButtonColor: '#007bff',
      text: 'Thanh toán đơn hàng thành công',
      icon: 'success',
      confirmButtonText: 'Tôi đã hiểu'
  })
}

'use strict';

let menu, animate;

(function () {
  // Initialize menu
  //-----------------

  let layoutMenuEl = document.querySelectorAll('#layout-menu');
  layoutMenuEl.forEach(function (element) {
    menu = new Menu(element, {
      orientation: 'vertical',
      closeChildren: false
    });
    // Change parameter to true if you want scroll animation
    window.Helpers.scrollToActive((animate = false));
    window.Helpers.mainMenu = menu;
  });

  // Initialize menu togglers and bind click on each
  let menuToggler = document.querySelectorAll('.layout-menu-toggle');
  menuToggler.forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      window.Helpers.toggleCollapsed();
    });
  });

  // Display menu toggle (layout-menu-toggle) on hover with delay
  let delay = function (elem, callback) {
    let timeout = null;
    elem.onmouseenter = function () {
      // Set timeout to be a timer which will invoke callback after 300ms (not for small screen)
      if (!Helpers.isSmallScreen()) {
        timeout = setTimeout(callback, 300);
      } else {
        timeout = setTimeout(callback, 0);
      }
    };

    elem.onmouseleave = function () {
      // Clear any timers set to timeout
      document.querySelector('.layout-menu-toggle').classList.remove('d-block');
      clearTimeout(timeout);
    };
  };
  if (document.getElementById('layout-menu')) {
    delay(document.getElementById('layout-menu'), function () {
      // not for small screen
      if (!Helpers.isSmallScreen()) {
        document.querySelector('.layout-menu-toggle').classList.add('d-block');
      }
    });
  }

  // Display in main menu when menu scrolls
  let menuInnerContainer = document.getElementsByClassName('menu-inner'),
    menuInnerShadow = document.getElementsByClassName('menu-inner-shadow')[0];
  if (menuInnerContainer.length > 0 && menuInnerShadow) {
    menuInnerContainer[0].addEventListener('ps-scroll-y', function () {
      if (this.querySelector('.ps__thumb-y').offsetTop) {
        menuInnerShadow.style.display = 'block';
      } else {
        menuInnerShadow.style.display = 'none';
      }
    });
  }

  // Init helpers & misc
  // --------------------

  // Init BS Tooltip
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Accordion active class
  const accordionActiveFunction = function (e) {
    if (e.type == 'show.bs.collapse' || e.type == 'show.bs.collapse') {
      e.target.closest('.accordion-item').classList.add('active');
    } else {
      e.target.closest('.accordion-item').classList.remove('active');
    }
  };

  const accordionTriggerList = [].slice.call(document.querySelectorAll('.accordion'));
  const accordionList = accordionTriggerList.map(function (accordionTriggerEl) {
    accordionTriggerEl.addEventListener('show.bs.collapse', accordionActiveFunction);
    accordionTriggerEl.addEventListener('hide.bs.collapse', accordionActiveFunction);
  });

  // Auto update layout based on screen size
  window.Helpers.setAutoUpdate(true);

  // Toggle Password Visibility
  window.Helpers.initPasswordToggle();

  // Speech To Text
  window.Helpers.initSpeechToText();

  // Manage menu expanded/collapsed with templateCustomizer & local storage
  //------------------------------------------------------------------

  // If current layout is horizontal OR current window screen is small (overlay menu) than return from here
  if (window.Helpers.isSmallScreen()) {
    return;
  }

  // If current layout is vertical and current window screen is > small

  // Auto update menu collapsed/expanded based on the themeConfig
  window.Helpers.setCollapsed(true, false);
})();
