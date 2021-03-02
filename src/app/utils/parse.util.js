module.exports = {
    parse: (data) => {
        let obj = {}
        try {
            obj = {
                email: data['email'],
                primary: data['primary'],
                secondary: data['secondary'],
                latitude: data['latitude'],
                longitude: data['longitude'],
                dob: JSON.stringify(data['dob']),
                pob: data['pob'],
                tob: JSON.stringify(data['tob']),
                fname: data['fname'],
                questions: data['questions']
            }
            obj.success = true;
        } catch (e) {
            obj.success = false;
        }

        return obj;
    }
}