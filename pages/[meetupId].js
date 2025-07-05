import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../components/meetups/MeetupDetail";
import Head from "next/head";

export default function MeetupDetails(props) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        description={props.meetupData.description}
        address={props.meetupData.address}
      />
    </>
  );
}

// Hàm này nhắc NextJS là nên tạo trước trang cho dynamic id nào
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://manshpypro:mansocho123@manduong.zkobn4f.mongodb.net/meetups?retryWrites=true&w=majority&appName=ManDuong"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();
  return {
    fallback: false, // false => paths chứa hết id (gõ m3 => ra lỗi), true -> paths chưa chứa hết ()
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}
export async function getStaticProps(context) {
  // fetch data for sigle meet up

  console.log("CONETXT OF MEETUP DETAIL: ", context);
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://manshpypro:mansocho123@manduong.zkobn4f.mongodb.net/meetups?retryWrites=true&w=majority&appName=ManDuong"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
        image: selectedMeetup.image,
      },
    },
  };
}
