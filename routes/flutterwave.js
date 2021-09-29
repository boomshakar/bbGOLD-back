const Flutterwave = require("flutterwave-node-v3");
const open = require("open");

const public_key = process.env.FLUTTERWAVE_PUBLIC_KEY;
const secret_key = process.env.FLUTTERWAVE_SECRET_KEY;
const encrpyt_key = process.env.FLUTTERWAVE_ENCRYPT_KEY;

const flw = new Flutterwave(public_key, secret_key);

// const payload = {
//     "card_number": "5531886652142950",
//     "cvv": "564",
//     "expiry_month": "09",
//     "expiry_year": "21",
//     "currency": "NGN",
//     "amount": "100",
//     "redirect_url": "https://www.google.com",
//     "fullname": "Olufemi Obafunmiso",
//     "email": "olufemi@flw.com",
//     "phone_number": "0902620185",
//     "enckey": "611d0eda25a3c931863d92c4",
//     "tx_ref": "MC-32444ee--4eerye4euee3rerds4423e43e" // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.

// }

const payload = {
  card_number: req.body.card_number,
  cvv: req.body.cvv,
  expiry_month: req.body.expiry_month,
  expiry_year: req.body.expiry_year,
  currency: req.body.currency,
  amount: req.body.amount,
  redirect_url: "https://www.google.com",
  fullname: req.body.fullname,
  email: req.body.email,
  phone_number: req.body.phone_number,
  enckey: encrpyt_key,
  tx_ref: new Date().getTime().toString(), // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
};

const chargeCard = async () => {
  try {
    const response = await flw.Charge.card(payload);
    console.log(response);
    if (response.meta.authorization.mode === "pin") {
      let payload2 = payload;
      payload2.authorization = {
        mode: "pin",
        fields: ["pin"],
        pin: 3310,
      };
      const reCallCharge = await flw.Charge.card(payload2);

      const callValidate = await flw.Charge.validate({
        otp: "12345",
        flw_ref: reCallCharge.data.flw_ref,
      });
      console.log(callValidate);
    }
    if (response.meta.authorization.mode === "redirect") {
      var url = response.meta.authorization.redirect;
      open(url);
    }

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

chargeCard();
