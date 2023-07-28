const tipoOption = document.getElementById("tipoServico");
const myForm = document.getElementById("myForm");

tipoOption.addEventListener("change", () => {
  const selectedValue = tipoOption.value;

  if (selectedValue !== "") {
    myForm.submit();
  }else{
    myForm.submit();
  }
});


