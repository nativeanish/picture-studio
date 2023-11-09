import IndexShow from "../components/IndexShow";
import NavBar from "../components/NavBar";

function Index() {
  return (
    <>
      <NavBar />
      <div className="mt-4">
        <IndexShow />
      </div>
    </>
  );
}

export default Index;
