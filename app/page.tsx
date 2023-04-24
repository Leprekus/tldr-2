import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import Card from './components/Card'
import { IRedditPost, RedditPostsResponse } from '@/typings'
import Pill from './components/Pill'
import PostFilters from './components/PostFilters'
import List from './Posts/List'

const preload = () => {
  posts()
}
const posts = async () => {
  const response = await fetch('https://www.reddit.com/.json?sort=new', { next: { revalidate: 120 } })
  const json = await response.json()
  return json
}
export default async function Home() {

  const data: RedditPostsResponse = await posts()

  const postsData = data.data.children.map((post:RedditPostsResponse) => post.data)
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
    <List data={postsData}/>
   
    </main>
  )
}
