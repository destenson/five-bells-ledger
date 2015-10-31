'use strict'

const passport = require('koa-passport')
const BasicStrategy = require('passport-http').BasicStrategy
const AnonymousStrategy = require('passport-anonymous').Strategy
const Account = require('../models/account').Account
const UnauthorizedError = require('five-bells-shared/errors/unauthorized-error')

passport.use(new BasicStrategy(
  function (username, password, done) {
    // If no Authorization is provided we can still
    // continue without throwing an error
    if (!username) {
      return done(null, false)
    }

    Account.findById(username)
      .then(function (userObj) {
        if (userObj && userObj.password === password) {
          return done(null, userObj.id)
        } else {
          return done(new UnauthorizedError('Unknown or invalid account / password'))
        }
      })
  }))

// Allow unauthenticated requests (transfers will just
// be in the proposed state)
passport.use(new AnonymousStrategy())
