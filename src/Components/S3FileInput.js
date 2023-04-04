import React, { Component } from "react";
import ReactS3Uploader from "react-s3-uploader";
import Toaster from "@bit/treble.components.toaster";

const MAX_SIZE = 15728640; // 15MB

export default class S3FileInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileType: null,
      fileName: "",
    };

    this.preprocess = this.preprocess.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  preprocess(file, next) {
    let maxSize = this.props.maxSize ? this.props.maxSize : MAX_SIZE;
    if (file.size > maxSize) {
      if (this.props.onLargeFile) this.props.onLargeFile(maxSize);
      return;
    }
    if (!this.props.accept.includes(file.type)) {
      Toaster({
        title: this.props.invalidFile,
        type: "error",
        closeButton: true,
      });
      return;
    }
    if (this.props.onStart) this.props.onStart();
    this.setState({ fileType: file.type, fileName: file.name });
    console.log("preprcess", file);
    next(file);
  }

  onFinish(e) {
    const { signedUrl } = e;
    console.log("on finish", signedUrl);
    const finalUrl = signedUrl.substring(0, signedUrl.indexOf("?"));
    this.props.callback({
      signedUrl: finalUrl,
      filename: this.state.fileName,
      fileType: this.state.fileType,
    });
  }

  render() {
    return <></>;
  }
}
