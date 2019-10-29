const feedparser = require('feedparser-promised');

const massMediaList = require('../data/yuiseki.net/mass_media_japan.json')

import { News } from './news'

export class MassMediaFeed {
  ready:Promise<any>
  url: string
  feed: string
  items: any

  public static crawlMediaFeeds = async(context) => {
    for (const massMedia of massMediaList){
      console.log(massMedia.name+": "+massMedia.feed)
      if(massMedia.feed===null){return}
      
      const feed = new MassMediaFeed(massMedia.feed)
      await feed.ready
      for (const item of feed.items){
        const news = new News(item.link)
        await news.ready
        await news.setOrUpdateNews(null)
      }
    }
  }

  constructor(url:string){
    this.url = url
    this.ready = new Promise(async (resolve, reject)=>{
      this.items = await feedparser.parse(this.url)
      resolve()
    })
  }
}

