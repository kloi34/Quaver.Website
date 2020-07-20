import Responses from "../../utils/Responses";
import Logger from "../../logging/Logger";
import API from "../../api/API";

const requestIp = require('request-ip');
const request = require("request");
const config = require("../../config/config.json");

export default class Donate {
    public static async GET(req: any, res: any): Promise<void> {
        try {
            let userStatus = null;
            let orders: any = null;
            let headers: any = {};

            if (req.user) {
                const token = await API.GetToken(req);

                if (token)
                    headers["Authorization"] = `Bearer ${token}`;

                userStatus = await API.GET(req, `v1/server/users/online/${req.user.id}`);

                orders = await new Promise(resolve => {
                    request.post(`${config.apiBaseUrl}/v1/donations/orders`, {
                        headers: headers,
                        json: true
                    }, function (error, response, body) {
                        resolve(body);
                    });
                }).then(body => body);
            }

            if (req.user && req.query.order) {
                try {
                    const order = req.query.order.split('-');

                    const orderId = order[0];
                    const transactionId = order[1];

                    let response: any = await new Promise(resolve => {
                        request.post(`${config.apiBaseUrl}/v1/donations/finalize`, {
                            form: {
                                oid: orderId,
                                tid: transactionId
                            },
                            headers: headers,
                            json: true
                        }, function (error, response, body) {
                            resolve(body);
                        });
                    }).then(body => body);
                    req.flash('success', response.message);
                    res.redirect(301, '/donate');
                    return;
                } catch (e) {
                    Logger.Error(e);
                    Responses.Return500(req, res);
                }
            }

            Responses.Send(req, res, "donate", `Donate | Quaver`, {
                playerStatus: userStatus,
                orders: orders
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    public static async CardGET(req: any, res: any): Promise<void> {
        try {
            if(req.body.username === "") {
                req.body.username = req.user.username;
            }

            const player = await API.GET(req, `v1/users?name=${req.body.username}`);

            let user: any = null;
            let playerStatus: any = null;

            if (player.users.length) {
                const temp = player.users[0];
                user = {
                    id: temp.id,
                    username: temp.username,
                    country: temp.country,
                    usergroups: temp.usergroups,
                    avatar_url: temp.avatar_url
                }

                playerStatus = await API.GET(req, `v1/server/users/online/${user.id}`);
            }

            Responses.Send(req, res, "donator/card", ``, {
                playerStatus: playerStatus,
                player: user,
                input: req.body.username
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    public static async POST(req: any, res: any): Promise<void> {
        try {
            const token = await API.GetToken(req);
            let headers: any = {};

            if (token)
                headers["Authorization"] = `Bearer ${token}`;

            let response;

            if (req.body) {
                response = await new Promise(resolve => {
                    request.post(`${config.apiBaseUrl}/v1/donations/initiate`, {
                        form: {
                            months: req.body.months,
                            gift: req.body.gift,
                            ip: "1.1.1.1"
                        },
                        headers: headers,
                        json: true
                    }, function (error, response, body) {
                        resolve(body);
                    });
                }).then(body => body);

                res.redirect(response.transaction.steamurl);
                return;
            }

            res.redirect(301, `/donate`);
        } catch (err) {
            Logger.Error(err);
            console.log(err);
            Responses.Return500(req, res);
        }
    }
}