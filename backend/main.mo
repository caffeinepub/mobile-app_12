import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Include prefabricated modules
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User profile type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  // Data models
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    stock : Nat;
    category : Text;
    image : Storage.ExternalBlob;
  };

  public type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  public type OrderStatus = {
    #pending;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : Text;
    userId : Principal;
    items : [CartItem];
    totalAmount : Nat;
    shippingAddress : Text;
    status : OrderStatus;
  };

  // Internal storage
  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();
  let carts = Map.empty<Principal, [CartItem]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product management
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  public query ({ caller }) func getProduct(productId : Text) : async ?Product {
    products.get(productId);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    let term = searchTerm.toLower();
    products.values().toArray().filter(
      func(p) {
        p.name.toLower().contains(#text term) or p.description.toLower().contains(#text term);
      }
    );
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(p) { p.category == category }
    );
  };

  // Cart management
  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };

    if (quantity == 0) { Runtime.trap("Quantity must be greater than 0") };

    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?prod) { prod };
    };

    if (quantity > product.stock) {
      Runtime.trap("Not enough stock available");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };

    let updatedCart = currentCart.concat([{
      productId;
      quantity;
    }]);
    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };

    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) {
        let updatedCart = cart.filter(func(item) { item.productId != productId });
        carts.add(caller, updatedCart);
      };
    };
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };

    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  // Order management
  public shared ({ caller }) func checkout(shippingAddress : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can checkout");
    };

    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?items) { items };
    };

    if (cart.size() == 0) { Runtime.trap("Cart is empty") };

    var totalAmount = 0;
    for (item in cart.values()) {
      let product = switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product does not exist") };
        case (?prod) { prod };
      };
      if (item.quantity > product.stock) {
        Runtime.trap("Not enough stock for product " # product.name);
      };
      totalAmount += product.price * item.quantity;
    };

    let orderId = caller.toText() # "_" # (orders.size().toText());
    let order : Order = {
      id = orderId;
      userId = caller;
      items = cart;
      totalAmount;
      shippingAddress;
      status = #pending;
    };

    orders.add(orderId, order);

    for (item in cart.values()) {
      let product = switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product does not exist") };
        case (?prod) { prod };
      };
      let updatedProduct = {
        product with
        stock = product.stock - item.quantity
      };
      products.add(updatedProduct.id, updatedProduct);
    };

    carts.remove(caller);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Text) : async ?Order {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
    };
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    orders.values().toArray().filter(
      func(o) { o.userId == caller }
    );
  };

  // Inventory management
  public query ({ caller }) func getLowStockProducts(threshold : Nat) : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view low stock products");
    };
    products.values().toArray().filter(
      func(p) { p.stock <= threshold }
    );
  };
};
