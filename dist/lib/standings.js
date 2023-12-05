"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStandings = void 0;
const Standings_1 = __importDefault(require("../models/Standings"));
const contest_1 = require("./contest");
const getStandings = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    let standingss = yield Standings_1.default.find({ cid: slug });
    let problems = yield (0, contest_1.get_problems)(slug, "");
    let standing = {};
    for (let i = 0; i < standingss.length; i++) {
        if (!standing[standingss[i].email]) {
            standing[standingss[i].email] = {
                submissions: new Array(problems.problems.length + 2).fill(null).map(item => ({
                    total_submit: 0,
                    penalty: 0,
                    status: false,
                    delay: 0
                })),
                penalty: 0,
                name: standingss[i].name,
                ac: 0
            };
        }
        let email = standingss[i].email;
        if (standingss && standing[email]) {
            standing[email].submissions[standingss[i].position].total_submit += 1;
            if (standingss[i].status) {
                standing[email].submissions[standingss[i].position].status = standingss[i].status;
                standing[email].submissions[standingss[i].position].delay = standingss[i].delay;
            }
            if (standing[email].submissions[standingss[i].position].status) {
                standing[email].submissions[standingss[i].position].penalty = (standing[email].submissions[standingss[i].position].total_submit - 1) * 20 + standing[email].submissions[standingss[i].position].delay;
            }
        }
    }
    let final = [];
    Object.keys(standing).forEach(item => {
        let ac = 0;
        standing[item].submissions.forEach(element => {
            standing[item].penalty += element.penalty;
            ac = ac + ((element.status === true) ? 1 : 0);
        });
        final.push({
            email: item,
            submissions: standing[item].submissions,
            name: standing[item].name,
            penalty: standing[item].penalty,
            ac
        });
    });
    final = final.sort((a1, a2) => {
        if (a1.ac < a2.ac)
            return 1;
        else if (a1.ac > a2.ac)
            return -1;
        else if (a1.penalty > a2.penalty)
            return 1;
        return -1;
    });
    return {
        standings: final,
        totalProblem: problems.problems.length
    };
});
exports.getStandings = getStandings;
