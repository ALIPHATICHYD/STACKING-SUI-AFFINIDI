module quest_4::marketplace {
    
    use sui::dynamic_object_field as ofield;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, ID, UID};
    use sui::coin::{Self, Coin};
    use sui::bag::{Bag, Self};
    use sui::table::{Table, Self};
    use sui::transfer;

    const EAmountIncorrect: u64 = 0;
    const ENotOwner: u64 = 1;

    // shared object, one instance of marketplace accepts only 1 type of coin for all listings
    struct Marketplace<phantom COIN> has key {
        id: UID,
        items: Bag,
        payments: Table<address, Coin<COIN>>
    }

    // create new shared marketplace
    public entry fun create<COIN>(ctx: &mut TxContext) {
        let id = object::new(ctx);
        let items = bag::new(ctx);
        let payments = table::new<address, Coin<COIN>>(ctx);
        transfer::share_object(Marketplace<COIN> { 
            id, 
            items,
            payments
         })
    }

    // single listing which contains listed item and its price in COIN
    // attach actual item as dynamic object field, so we dont define any item field here
    struct Listing has key, store {
        id: UID,
        ask: u64,
        owner: address
    }

}