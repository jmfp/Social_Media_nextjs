import { getUser, getUserPosts, sendFriendRequest, getUserFriends, getUserObject } from '@/actions/actions'
import { getSession } from '@/app/auth/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import ReactPlayer from 'react-player'
import Base64VideoPlayer from '@/app/components/video/Video'
import Post from '@/app/components/post/Post'
import { post } from '@/app/lib/interface'
import { FaUserFriends } from "react-icons/fa";
import { ParallaxHero } from '@/app/components/images/image'

export default async function UserPage({params}: {params:{id: string}}) {
    const user = await getUser()
    const userPosts = await getUserPosts(params.id)
    //const friends = await getUserFriends(user)
    //const userObject = await getUserObject(user)
    const pageUser = await getUserObject(params.id)
  return (
    <div className='display: flex flex-col h-full'>
       <ParallaxHero height={20} image="https://images.unsplash.com/photo-1427501482951-3da9b725be23?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">

       <Image 
          src={`${pageUser?.profilePic}`}
          alt=""
          height={1080}
          width={1920}
          className='object-cover h-24 w-24 m-6 border border-primary rounded-full '
          
        />

       <div className='display: flex ml-3  md:mt-12 items-center'>
          <p className="text-primary ml-6">{pageUser?.username}</p>
          <FaUserFriends className="text-primary mx-3"/>
          <p>{pageUser?.friends.length}</p>
       </div>

        <div className='display: flex justify-center w-full h-60 m-2'>
          <form action={async (formData: FormData) =>{
            'use server'
            if(user !== params.id){
              await sendFriendRequest(user, params.id)
            }
          }}>
            {pageUser?.friends.includes(user) || user === params.id ? 
            <p className='text-primary'>{`You and ${pageUser?.username} are friends.`}</p>:
              <Button type="submit">Add Friend</Button>
            }

          </form>
        </div>
       </ParallaxHero>
      <div className="display: flex flex-col max-sm:pt-64 max-md:pt-32 pt-24 m-auto overflow-y-scroll">
          {!userPosts? 
            <span/> : 
              userPosts.map((post: any, idx: number) => {
                const newPost: any = {
                  friendId: params.id,
                  pic: pageUser?.profilePic,
                  content: post.content,
                  pictures: post.pictures,
                  likes: post.likes
                }
                return(
                  <Post key={idx} post={
                    newPost
                  }/>
                )
              })
          }
      </div>
      <div>
      </div>
    </div>
  )
}
