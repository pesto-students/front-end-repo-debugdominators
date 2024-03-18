"use client";
import Link from "next/link";
import { Button, Image, Input } from "antd";
import { DislikeOutlined, LikeOutlined, SaveOutlined } from "@ant-design/icons";

export default function Dashboard() {
  return (
    <div className="p-4">
      <Image
        height={300}
        width="100%" // Set the width of the image
        src=""
        alt="Your Alt Text"
      />
      <Link href="#" className="block mt-4 text-blue-500">
        Guide/Technology
      </Link>
      <div className="border border-red-500 w-3/4 mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold">
          How to Optimize your code reviews and grow
        </h1>
        <p className="mt-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus
          numquam dignissimos, ut sit praesentium blanditiis culpa voluptatem
          dolorem a earum autem voluptas, vero voluptate aut pariatur neque,
          veniam alias itaque. Obcaecati at unde consectetur rerum voluptatibus
          adipisci, nesciunt natus, ea officiis nobis ducimus hic maiores
          suscipit, eligendi itaque eaque earum ut id voluptatum laborum. Fugit
          delectus unde voluptatem. Inventore, maxime? Aliquam suscipit
          dignissimos, culpa ea deleniti totam? Minus, aliquid repellat! Rem
          commodi totam explicabo, maxime a quidem cum voluptatum. Eligendi odit
          sequi molestiae optio doloribus, autem dicta quia nam pariatur. Sint,
          fugit. Id libero est numquam illo recusandae tempora quo sequi ad
          placeat, quia non expedita nam corrupti cum quam in possimus
          asperiores similique suscipit. Recusandae deleniti commodi optio
          adipisci! Enim fugit totam non blanditiis impedit quas earum vitae
          neque dignissimos porro. Quaerat nemo non facere optio harum,
          repudiandae totam fugit corporis nobis quae error vitae aliquam
          tempora recusandae molestiae. Earum maxime magnam, placeat voluptatum
          veritatis perspiciatis iste. Eum, quia! Omnis recusandae et facere
          tenetur, assumenda ad quas nostrum, distinctio saepe provident, vel
          nisi sapiente doloremque magnam impedit at beatae. Soluta ad ut porro
          sequi voluptates ipsam ratione voluptate laborum aut! Dignissimos,
          recusandae asperiores vel reprehenderit mollitia voluptate tempore
          laudantium ducimus rerum, ratione quia fugit dolorem quibusdam
          blanditiis excepturi officiis? Amet sunt harum vel enim. Iste odit
          dolorum, culpa quaerat atque ex necessitatibus minima numquam
          obcaecati laborum, earum voluptas unde eius ipsum eum quisquam nobis?
          Facere aliquam voluptatibus nostrum a. Porro vero quas, animi dolorum
          tempora eos doloribus facere debitis eius quisquam iusto deserunt
          corrupti eveniet mollitia ab voluptatem quidem possimus placeat quae,
          beatae laborum distinctio quaerat voluptatibus! Velit, voluptatum!
          Sequi, quis voluptates aspernatur debitis cupiditate assumenda quos,
          quod obcaecati ratione nesciunt reiciendis magni recusandae aliquid,
          tempora eligendi omnis eveniet unde. Expedita voluptatum numquam vero
          nemo, facilis harum? Fugiat, iste.
        </p>
        <div
          style={{ border: "2px solid" }}
          className="flex justify-between mt-8 mb-12"
        >
          <div
            style={{ border: "2px solid", width: "50%" }}
            className="flex items-center  justify-between"
          >
            <Image
              style={{ height: "60px", width: "60px" }}
              className="w-14 h-14 border-2"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
              alt=""
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>Shree Hari</p>
              <p>Dec 02</p>
              <p>2 min read</p>
            </div>
          </div>
          <div className="flex items-center w-2/5 justify-between">
            <Button icon={<LikeOutlined />} size="small">
              Like
            </Button>
            <Button icon={<DislikeOutlined />} size="small">
              Dislike
            </Button>
            <Button icon={<SaveOutlined />} size="small">
              Save
            </Button>
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-8">Comments(1)</h1>
        <Input.TextArea
          placeholder="Add to discussion"
          className="border w-full mt-4"
          rows={4}
        />
      </div>
    </div>
  );
}
