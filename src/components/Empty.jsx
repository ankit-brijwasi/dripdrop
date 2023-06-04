import emptyBox from "../assets/empty-box.png";

export default function Empty({ style }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "column",
        minHeight: "100vh",
        width: "100%",
        ...style,
      }}
    >
      <img src={emptyBox} alt="nothing to show here" />
      Nothing to show here
    </div>
  );
}
