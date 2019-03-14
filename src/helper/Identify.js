import React from 'react';
import md5 from 'md5';

class Identify {
    static location = {};

    static makeid() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return md5(text + Date.now());
    }

    static formatAddress(place){
        let address = place.description.split(',');
        let mainAddress = address[0];
        let otherAddress = address.slice(1, address.lenghts);
        let description = otherAddress.join(',')
        return {
            mainAddress,
            description
        }
    }
    
}

export default Identify;