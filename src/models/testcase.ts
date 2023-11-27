import mongoose, { model, Document, Schema, models, Model } from "mongoose";
import { ITestcase } from "../types/main";



const schema = new Schema<ITestcase & Document>({
    slug: String,
    input: String,
    output: String,
    isSample: Boolean,
    explaination: String
})

const TestcaseModel:Model<ITestcase & Document> = models.testcase || mongoose.model<ITestcase & Document>("testcase", schema);

export default TestcaseModel;