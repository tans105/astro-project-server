module.exports = {
    parse: (data) => {
        let obj = {}
        try {
            obj = {
                email: data['email'],
                primary: data['primary'],
                secondary: data['secondary'],
                dob: JSON.stringify(data['dob']),
                pob: data['pob'],
                sob: data['sob'],
                tob: JSON.stringify(data['tob']),
                fname: data['fname'],
                questions: data['questions'],
                amount: data['amount'],
                service: data['service']
            }
            obj.success = true;
        } catch (e) {
            obj.success = false;
        }

        return obj;
    }
}