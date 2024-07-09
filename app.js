document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.querySelector(".product-list");
  const categorySelect = document.getElementById("category");
  const brandSelect = document.getElementById("brand");
  const priceMinInput = document.getElementById("price-min");
  const priceMaxInput = document.getElementById("price-max");
  const clearFiltersButton = document.getElementById("clear-filters");
  const sortSelect = document.getElementById("sort");
  let products = [];

  // Fetch product data
  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      initializeFilters();
      displayProducts(products);
    });

  function initializeFilters() {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    const brands = [...new Set(products.map((product) => product.brand))];

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });

    brands.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
  }

  function displayProducts(productList) {
    productContainer.innerHTML = "";
    if (productList.length === 0) {
      productContainer.textContent = "No results found";
      return;
    }

    productList.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("product");
      productElement.innerHTML = `
                <h4>${product.name}</h4>
                <p>Price: ${product.price}</p>
                <p>Category: ${product.category}</p>
                <p>Brand: ${product.brand}</p>
            `;
      productContainer.appendChild(productElement);
    });
  }

  function filterProducts() {
    const category = categorySelect.value;
    const brand = brandSelect.value;
    const priceMin = parseFloat(priceMinInput.value) || 0;
    const priceMax = parseFloat(priceMaxInput.value) || Infinity;

    let filteredProducts = products.filter((product) => {
      return (
        (category === "" || product.category === category) &&
        (brand === "" || product.brand === brand) &&
        product.price >= priceMin &&
        product.price <= priceMax
      );
    });

    displayProducts(filteredProducts);
  }

  function sortProducts(productList) {
    const sortBy = sortSelect.value;
    if (sortBy === "price-asc") {
      productList.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      productList.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      productList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      productList.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  categorySelect.addEventListener("change", filterProducts);
  brandSelect.addEventListener("change", filterProducts);
  priceMinInput.addEventListener("input", filterProducts);
  priceMaxInput.addEventListener("input", filterProducts);
  sortSelect.addEventListener("change", () => {
    sortProducts(products);
    filterProducts();
  });

  clearFiltersButton.addEventListener("click", () => {
    categorySelect.value = "";
    brandSelect.value = "";
    priceMinInput.value = "";
    priceMaxInput.value = "";
    sortSelect.value = "default";
    displayProducts(products);
  });
});
