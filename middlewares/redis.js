require('dotenv').config()
const Redis = require('ioredis')

const connect = { set: () => {} }

const useRedis = async (req, res, next) => {
  try {
    // const isPaginate = await connect.get('is_paginate')
    // const data = await connect.get('data')
    // const total = await connect.get('total')
    // const limit = await connect.get('limit')
    // const page = await connect.get('page')
    // const url = await connect.get('url')
    // const urlMatch = url === req.originalUrl

    // if (urlMatch && data) {
    //   if (isPaginate) {
    //     res.status(200).json({
    //       redis: true,
    //       status: true,
    //       message: 'data berhasil di ambil',
    //       total: total,
    //       page: page,
    //       limit: limit,
    //       data: JSON.parse(data),
    //     })
    //   } else {
    //     res.status(200).json({
    //       redis: true,
    //       status: true,
    //       message: 'data berhasil di ambil',
    //       data: JSON.parse(data),
    //     })
    //   }
    // } else {

    // }
    next()
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

module.exports = { useRedis, connect }
