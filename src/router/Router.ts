import * as express from "express";
import Home from "../controllers/home/Home";
import Login from "../controllers/login/Login";
import Team from "../controllers/team/Team";
import LeaderBoard from "../controllers/leaderboard/Leaderboard";
import Maps from "../controllers/maps/Maps";
import Users from "../controllers/users/Users";
import Playlists from "../controllers/playlists/Playlists";
import Download from "../controllers/download/Download";
import Authentication from "../middleware/Authentication";
import Multiplayer from "../controllers/multiplayer/Multiplayer";
import Error from "../controllers/error/Error";

export default class Router {
    /**
     * @param app 
     */
    public static InitializeRouter(app: Express.Application): express.Router {
        const router: express.Router = express.Router();

        router.route("/").get(Home.GET);
        router.route("/leaderboard").get(LeaderBoard.GET);
        router.route("/leaderboard/hits").get(LeaderBoard.TotalHitsGET);
        router.route("/leaderboard/multiplayer").get(LeaderBoard.MultiplayerGET);
        router.route('/maps').get(Maps.MapsGET);
        router.route('/maps/load').post(Maps.MapsSearchPOST);
        router.route("/mapset/:id").get(Maps.MapsetGET);
        router.route("/mapset/map/:id").get(Maps.MapGET);
        router.route("/mapset/map/:id/mods").get(Maps.ModsGET);
        router.route("/playlists").get(Playlists.PlaylistsGET);
        router.route("/playlists/load").post(Playlists.PlaylistsMoreGET);
        router.route("/playlist/:id").get(Playlists.GET);
        router.route("/multiplayer/games").get(Multiplayer.MutliplayerGamesGET);
        router.route("/multiplayer/game/:id").get(Multiplayer.MutliplayerGameGET);
        router.route("/user/:id").get(Users.GET);
        router.route("/user/maps/load").post(Users.UserMapssetsPOST);
        router.route("/user/scores/load").post(Users.UserScoresPOST);
        // router.route("/wiki").get(Wiki.HomeGET);
        // router.route("/wiki/*").get(Wiki.WikiPageGET);
        router.route("/login").get(Login.GET);
        router.route("/login/verify").get(Login.VerifyGET);
        router.route("/logout").get(Login.LogoutGET);
        router.route("/team").get(Team.GET);

        router.route("/mapset/:id").post(Maps.HandlePost);
        router.route("/mapset/map/:id").post(Maps.HandlePost);
        router.route("/mapset/map/:id/mods").post(Maps.HandlePostMods);

        router.route("/download/:type/:id").get(Download.GET);

        // Redirect old routes
        router.get('/profile/*', function(req:any, res:any){
            res.redirect(301, '/user/' + req.params[0], );
        });
        router.get('/mapsets/*', function(req:any, res:any){
            res.redirect(301, '/mapset/' + req.params[0]);
        });

        router.route("*").get(Error.GET);

        return router;
    }
}