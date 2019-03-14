import { Alert } from 'react-native'

class Connection {
    constructor() {
        this.defaultUrl = 'https://maps.googleapis.com/maps/api/';
        this.apiKey = 'AIzaSyB099MG2P4QVd0aksI8bh6q30X6X282FQ0';
        this._dataGet = null;
        this._init = { credentials: 'include' };
    }
    setGetData(data, noEncode = false) {
        this._dataGet = Object.keys(data).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
    }
    connect(url,obj, method='GET'){
        let _fullUrl = this.defaultUrl + url;
        _fullUrl += "?" + this._dataGet + '&key=' + this.apiKey;
        this._init['method'] = method;
        console.log(_fullUrl)
        let _request = new Request(_fullUrl, this._init);
        fetch(_request)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                let errors = {};
                errors['errors'] = { message: 'Network response was not ok' }
                return errors;
                //throw new Error();
            })
            .then(function (data) {
                if (data.errors) {
                    let errors = data.errors;
                    Alert.alert(
                        'Error',
                        errors.message,
                    );

                } else {
                    obj.setData(data);
                }
                // obj.setLoaded(true);
                //}
            }).catch((error) => {
                Alert.alert(
                    'Error',
                    'Something went wrong'
                );
                console.log(error);
        });
    }
}
const connection = new Connection();
export default connection;