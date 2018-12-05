const persistentCart = () => {
    const key = 'pricespyCartProducts';

    return {
        persist: (data) => {
            localStorage.setItem(key, JSON.stringify(Array.from(data.entries())));
        },
        get: () => JSON.parse(localStorage.getItem(key))
    }
};

export default persistentCart;