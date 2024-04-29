const client = require('./client.js');


async function helper(key, cb) {
  const data = await client.get(key);

  if (data) {
    console.log("Cache hit");
    return data;
  }
  
  console.log("Cache miss");
  const freshData = await cb();
  client.set(key, freshData);
  return freshData;
}

module.exports = { helper };